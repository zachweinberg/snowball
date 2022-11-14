import {
  Alert,
  AlertCondition,
  AlertDestination,
  AssetType,
  DailyBalance,
  Period,
  PlaidAccount,
  PlaidItem,
  Portfolio,
  RealEstatePosition,
  User,
} from 'schema';
import Bull from 'bull';
import { DateTime } from 'luxon';
import { getCryptoPrices } from '~/lib/cmc';
import { sendAssetAlertEmail, sendPortfolioSummaryEmail } from '~/lib/email';
import { getStockPrices } from '~/lib/iex';
import { sendText } from '~/lib/phone';
import { plaidClient } from '~/lib/plaid';
import { logSentryError } from '~/lib/sentry';
import { fetchEstimateFromEstated } from '~/lib/valuations';
import { decrypt } from '~/utils/crypto';
import { createDocument, deleteDocument, fetchDocumentByID, updateDocument, WithID } from '~/utils/db';
import { formatMoneyFromNumber } from '~/utils/money';
import { calculatePortfolioSummary } from '~/utils/positions';
import { JobNames, jobQueue } from '.';

const startWorker = (): void => {
  jobQueue.process(JobNames.AssetAlertsStocks, processAssetAlerts);
  jobQueue.process(JobNames.AssetAlertsCrypto, processAssetAlerts);
  jobQueue.process(JobNames.AddDailyBalances, addDailyBalances);
  jobQueue.process(JobNames.SendPortfolioSummaryEmails, sendPortfolioSummaryEmails);
  jobQueue.process(JobNames.UpdatePropertyValue, updatePropertyValue);
  jobQueue.process(JobNames.UpdatePlaidCashAccounts, updatePlaidCashAccounts);
  console.log('> [Consumer] Worker online');
};

const processAssetAlerts = async (job: Bull.Job) => {
  const { alerts, type } = job.data as { alerts: Alert[]; type: AssetType };

  console.log(`> [Consumer] Received ${alerts.length} ${type} alerts to process`);

  // Ensure docs exist
  for (let i = 0; i < alerts.length; i++) {
    try {
      await fetchDocumentByID('alerts', alerts[i].id);
    } catch (err) {
      alerts.splice(i, 1);
    }
  }

  let prices = {};

  try {
    if (type === AssetType.Stock) {
      prices = await getStockPrices(alerts.map((alert) => alert.symbol));
    } else if (type === AssetType.Crypto) {
      prices = await getCryptoPrices(alerts.map((alert) => alert.objectID));
    }

    for (const alert of alerts) {
      try {
        await sendAlertIfHit(alert, prices[alert.symbol]?.latestPrice);
      } catch (err) {
        console.error(err);
        logSentryError(err);
      }
    }
  } catch (err) {
    console.error(`JOB ID: ${job.id}`);
    console.error(err);
    logSentryError(err);
  }
};

const sendAlertIfHit = async (alert: Alert, currPrice?: number) => {
  if (!currPrice) return;

  if (alert.condition === AlertCondition.Above && currPrice > alert.price) {
    await sendAlertNotification(alert);
  } else if (alert.condition === AlertCondition.Below && currPrice < alert.price) {
    await sendAlertNotification(alert);
  }
};

const sendAlertNotification = async (alert: Alert) => {
  if (alert.destination === AlertDestination.Email) {
    console.log(`> [Consumer] Sending Email...`);
    await sendAssetAlertEmail(alert);
    await deleteDocument(`alerts/${alert.id}`);
  } else if (alert.destination === AlertDestination.SMS) {
    console.log(`> [Consumer] Sending SMS...`);
    await sendText(
      alert.destinationValue,
      `Obsidian Tracker alert:\n\nYour asset alert for ${
        alert.symbol
      } is ${alert.condition.toLowerCase()} your price target of ${formatMoneyFromNumber(
        alert.price
      )}.\n\nThis alert has been removed from your alerts on obsidiantracker.com`
    );
    await deleteDocument(`alerts/${alert.id}`);
  }
};

const addDailyBalances = async (job: Bull.Job) => {
  const { portfolioIDs } = job.data as { portfolioIDs: string[] };

  for (const portfolioID of portfolioIDs) {
    try {
      const { cryptoValue, cashValue, stocksValue, realEstateValue, customsValue, totalValue } = await calculatePortfolioSummary(
        portfolioID
      );

      await createDocument<DailyBalance>(`portfolios/${portfolioID}/dailyBalances`, {
        date: new Date(),
        cashValue,
        cryptoValue,
        stocksValue,
        realEstateValue,
        customsValue,
        totalValue,
      });
    } catch (err) {
      console.error(`JOB ID: ${job.id}`);
      console.error(err);
      logSentryError(err);
    }
  }
};

const sendPortfolioSummaryEmails = async (job: Bull.Job) => {
  const { period, portfolios } = job.data as { period: Period; portfolios: Portfolio[] };

  for (const portfolio of portfolios) {
    try {
      const { cryptoValue, cashValue, stocksValue, realEstateValue, customsValue, totalValue } = await calculatePortfolioSummary(
        portfolio.id
      );

      const user = await fetchDocumentByID<User>('users', portfolio.userID);

      await sendPortfolioSummaryEmail(
        user.email,
        period,
        portfolio.name,
        portfolio.id,
        stocksValue,
        cryptoValue,
        cashValue,
        realEstateValue,
        customsValue,
        totalValue,
        DateTime.local().toLocaleString(),
        user.name
      );
    } catch (err) {
      console.error(`JOB ID: ${job.id}`);
      console.error(err);
      logSentryError(err);
    }
  }
};

const updatePropertyValue = async (job: Bull.Job) => {
  const { realEstatePosition } = job.data as { realEstatePosition: RealEstatePosition };

  if (realEstatePosition.automaticValuation) {
    const estimate = await fetchEstimateFromEstated(realEstatePosition.address);

    if (!estimate) {
      return;
    }

    await updateDocument(`real-estate-positions`, realEstatePosition.id, { propertyValue: estimate });
  }
};

const updatePlaidCashAccounts = async (job: Bull.Job) => {
  try {
    const { plaidAccount } = job.data as { plaidAccount: WithID<PlaidAccount> };

    const plaidItem = await fetchDocumentByID<PlaidItem>('plaid-items', plaidAccount.plaidItemID);

    const accessToken = decrypt(plaidItem.plaidAccessToken);

    const balanceResponse = await plaidClient.accountsBalanceGet({
      access_token: accessToken,
    });

    const currentBalance =
      balanceResponse.data.accounts?.find((account) => account.account_id === plaidAccount.plaidAccountID)?.balances?.available ??
      0;

    await Promise.all([
      updateDocument('plaid-accounts', plaidAccount.id, { currentBalance }),
      updateDocument(`portfolios/${plaidAccount.portfolioID}/positions`, plaidAccount.positionID, { amount: currentBalance }),
    ]);
  } catch (err) {
    console.error(err);
    logSentryError(err);
    throw err;
  }
};

startWorker();
