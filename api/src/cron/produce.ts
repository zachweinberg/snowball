import { Alert, AssetType, Period, PlaidAccount, Portfolio, RealEstatePosition } from '@zachweinberg/obsidian-schema';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { JobNames, jobQueue } from '~/queue';
import { findDocuments } from '~/utils/db';

export const produceDailyBalancesJobs = async () => {
  const portfolios = await findDocuments<Portfolio>('portfolios');

  console.log(`> Adding daily balances to ${portfolios.length} portfolios...`);

  const portfolioIDs = portfolios.map((p) => p.id);

  const chunks = _.chunk(portfolioIDs, 5);

  for (const chunk of chunks) {
    await jobQueue.add(JobNames.AddDailyBalances, { portfolioIDs: chunk }, { attempts: 2 });
  }
};

export const producePortfolioEmailJobs = async (period: Period) => {
  const summaryEmailPortfolios = await findDocuments<Portfolio>('portfolios', [
    { property: 'settings.summaryEmailPeriod', condition: '==', value: period },
  ]);

  console.log(`> Found ${summaryEmailPortfolios.length} summary emails to send...`);

  const summaryChunks = _.chunk(summaryEmailPortfolios, 5);

  for (const portfolios of summaryChunks) {
    await jobQueue.add(JobNames.SendPortfolioSummaryEmails, {
      portfolios,
      period,
    });
  }
};

const STOCK_MARKET_OPEN_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const producePriceAlertJobs = async () => {
  // Crypto alerts
  const cryptoAlerts = await findDocuments<Alert>('alerts', [
    { property: 'assetType', condition: '==', value: AssetType.Crypto },
  ]);

  console.log(`> Found ${cryptoAlerts.length} crypto alerts to process...`);

  const cryptoChunks = _.chunk(cryptoAlerts, 5);

  for (const alerts of cryptoChunks) {
    await jobQueue.add(
      JobNames.AssetAlertsCrypto,
      { alerts, type: AssetType.Crypto },
      {
        attempts: 3,
      }
    );
  }

  // Stock alerts
  // Only do stocks if market is open
  const dow = DateTime.local().setZone('America/New_York').weekdayLong;
  const hour = DateTime.local().setZone('America/New_York').hour;

  if (STOCK_MARKET_OPEN_DAYS.includes(dow) && hour >= 9 && hour <= 16) {
    const stockAlerts = await findDocuments<Alert>('alerts', [
      { property: 'assetType', condition: '==', value: AssetType.Stock },
    ]);

    console.log(`> Found ${stockAlerts.length} stock alerts to process...`);

    const stockChunks = _.chunk(stockAlerts, 5);

    for (const alerts of stockChunks) {
      await jobQueue.add(
        JobNames.AssetAlertsStocks,
        { alerts, type: AssetType.Stock },
        {
          attempts: 3,
        }
      );
    }
  }
};

export const produceUpdatePropertyValuesJob = async () => {
  const realEstatePositionsToUpdate = await findDocuments<RealEstatePosition>('real-estate-positions', [
    { property: 'automaticValuation', condition: '==', value: true },
  ]);

  for (const realEstatePosition of realEstatePositionsToUpdate) {
    await jobQueue.add(JobNames.UpdatePropertyValue, { realEstatePosition }, { attempts: 2 });
  }
};

export const updatePlaidCashAccounts = async () => {
  const cashPlaidAccounts = await findDocuments<PlaidAccount>('plaid-accounts', [
    { property: 'forAssetType', condition: '==', value: AssetType.Cash },
  ]);

  console.log(`Found ${cashPlaidAccounts.length} cash plaid accounts to update`);

  for (const plaidAccount of cashPlaidAccounts) {
    await jobQueue.add(JobNames.UpdatePlaidCashAccounts, { plaidAccount }, { attempts: 2 });
  }
};
