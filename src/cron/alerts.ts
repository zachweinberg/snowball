import { Alert, AssetType } from '@zachweinberg/obsidian-schema';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { assetAlertsQueue, JobNames } from '~/queue';
import { findDocuments } from '~/utils/db';

const STOCK_MARKET_OPEN_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const triggerPriceAlertsJobs = async () => {
  // Crypto alerts
  const cryptoAlerts = await findDocuments<Alert>('alerts', [
    { property: 'assetType', condition: '==', value: AssetType.Crypto },
  ]);

  console.log(`> Found ${cryptoAlerts.length} crypto alerts to process...`);

  const cryptoChunks = _.chunk(cryptoAlerts, 5);

  for (const alerts of cryptoChunks) {
    await assetAlertsQueue.add(
      JobNames.AssetAlertsCrypto,
      { alerts, type: AssetType.Crypto },
      {
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: true,
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
      await assetAlertsQueue.add(
        JobNames.AssetAlertsStocks,
        { alerts, type: AssetType.Stock },
        {
          attempts: 3,
          removeOnComplete: true,
          removeOnFail: true,
        }
      );
    }
  }
};
