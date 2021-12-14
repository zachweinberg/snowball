import { Alert } from '@zachweinberg/obsidian-schema';
import { assetAlertsQueue, JobNames } from '.';

export const createStockAlertsJob = (alerts: Alert[]) => {
  return assetAlertsQueue.add(JobNames.AssetAlertsStocks, alerts, {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: true,
  });
};

export const createCryptoAlertsJob = (alerts: Alert[]) => {
  return assetAlertsQueue.add(JobNames.AssetAlertsCrypto, alerts, {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: true,
  });
};
