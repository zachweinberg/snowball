import { Alert, AlertCondition, AlertDestination, AssetType, DailyBalance } from '@zachweinberg/obsidian-schema';
import Bull from 'bull';
import { getCryptoPrices } from '~/lib/cmc';
import { sendAssetAlertEmail } from '~/lib/email';
import { getStockPrices } from '~/lib/iex';
import { sendText } from '~/lib/phone';
import { createDocument, deleteDocument, fetchDocumentByID } from '~/utils/db';
import { formatMoneyFromNumber } from '~/utils/money';
import { calculatePortfolioSummary } from '~/utils/positions';
import { JobNames, jobQueue } from '.';

const startWorker = (): void => {
  jobQueue.process(JobNames.AssetAlertsStocks, processAssetAlerts);
  jobQueue.process(JobNames.AssetAlertsCrypto, processAssetAlerts);
  jobQueue.process(JobNames.AddDailyBalances, addDailyBalances);
  console.log('> [Consumer] Worker online');
};

const processAssetAlerts = async (job: Bull.Job) => {
  const data = job.data;
  const alerts = data.alerts as Alert[];
  const type = data.type as AssetType;

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

  if (type === AssetType.Stock) {
    prices = await getStockPrices(alerts.map((alert) => alert.symbol));
  } else if (type === AssetType.Crypto) {
    prices = await getCryptoPrices(alerts.map((alert) => alert.symbol));
  }

  for (const alert of alerts) {
    await sendAlertIfHit(alert, prices[alert.symbol]?.latestPrice);
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
  const data = job.data;
  const portfolioIDs = data.portfolioIDs;

  for (const portfolioID of portfolioIDs) {
    const { cryptoValue, cashValue, stocksValue, realEstateValue, customsValue, totalValue } =
      await calculatePortfolioSummary(portfolioID);

    await createDocument<DailyBalance>(`portfolios/${portfolioID}/dailyBalances`, {
      date: new Date(),
      cashValue,
      cryptoValue,
      stocksValue,
      realEstateValue,
      customsValue,
      totalValue,
    });
  }
};

startWorker();
