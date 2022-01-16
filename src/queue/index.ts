import Bull from 'bull';
import { logSentryError } from '~/lib/sentry';

export enum JobNames {
  AssetAlertsStocks = 'asset-alerts-stocks',
  AssetAlertsCrypto = 'asset-alerts-crypto',
  AddDailyBalances = 'add-daily-balances',
}

export const jobQueue = new Bull('job-queue', process.env.REDIS_URL!, {
  redis: { tls: { rejectUnauthorized: false } },
  defaultJobOptions: { removeOnComplete: true, removeOnFail: true },
});

jobQueue.on('error', (error) => {
  console.error(error);
  logSentryError(error);
});

jobQueue.on('failed', (job, error) => {
  console.log(job.name, ' failed');
  console.error(error);
  logSentryError(error);
});
