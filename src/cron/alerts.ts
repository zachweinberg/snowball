import { Alert, AssetType } from '@zachweinberg/obsidian-schema';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { createCryptoAlertsJob, createStockAlertsJob } from '~/queue/producer';
import { findDocuments } from '~/utils/db';

const MARKET_OPEN_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const processAlerts = async () => {
  const dow = DateTime.local().setZone('America/New_York').weekdayLong;

  if (!MARKET_OPEN_DAYS.includes(dow)) {
    return;
  }

  const hour = DateTime.local().setZone('America/New_York').hour;

  if (hour >= 9 && hour <= 16) {
    const alerts = await findDocuments<Alert>('alerts');

    const stockAlerts = alerts.filter((alert) => alert.assetType === AssetType.Stock);
    const cryptoAlerts = alerts.filter((alert) => alert.assetType === AssetType.Crypto);

    const stockChunks = _.chunk(stockAlerts, 5);
    const cryptoChunks = _.chunk(cryptoAlerts, 5);

    for (const stockChunk of stockChunks) {
      await createStockAlertsJob(stockChunk);
    }

    for (const cryptoChunk of cryptoChunks) {
      await createCryptoAlertsJob(cryptoChunk);
    }
  }
};
