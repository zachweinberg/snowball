import Bull from 'bull';
import { logSentryError } from '~/lib/sentry';

export enum JobNames {
  AssetAlertsStocks = 'asset-alerts-stocks',
  AssetAlertsCrypto = 'asset-alerts-crypto',
  AddDailyBalances = 'add-daily-balances',
  SendPortfolioSummaryEmails = 'send-portfolio-summary-emails',
  SendPortfolioReminderEmails = 'send-portfolio-reminder-emails',
  UpdatePropertyValue = 'update-property-value',
}

export const jobQueue = new Bull('job-queue', process.env.REDIS_URL!, {
  redis: { tls: { rejectUnauthorized: false } },
  defaultJobOptions: { removeOnComplete: false, removeOnFail: false },
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
