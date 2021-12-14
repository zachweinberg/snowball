import Bull from 'bull';
import { logSentryError } from '~/lib/sentry';

export enum JobNames {
  AssetAlertsStocks = 'asset-alerts-stocks',
  AssetAlertsCrypto = 'asset-alerts-crypto',
}

export const assetAlertsQueue = new Bull('asset-alerts', process.env.REDIS_URL!, {
  redis: { tls: { rejectUnauthorized: false } },
  defaultJobOptions: { removeOnComplete: true, removeOnFail: true },
});

assetAlertsQueue.on('error', (error) => {
  console.error(error);
  logSentryError(error);
});

assetAlertsQueue.on('failed', (job, error) => {
  console.log('-- FAILED ASSET ALERT JOB --');
  console.log(job);
  console.error(error);
  logSentryError(error);
});
