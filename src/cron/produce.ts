import { Alert, AssetType, Period, Portfolio } from '@zachweinberg/obsidian-schema';
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

export const produceEmailReminders = async (period: Period) => {
  const portfoliosToEmail = await findDocuments<Portfolio>('portfolios', [
    { property: 'settings.reminderEmailPeriod', condition: '==', value: period },
  ]);
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
