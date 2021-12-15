import { Alert, AlertCondition, AlertDestination } from '@zachweinberg/obsidian-schema';
import { getCryptoPrices } from '~/lib/cmc';
import { getStockPrices } from '~/lib/iex';
import { assetAlertsQueue, JobNames } from '.';

const startWorker = (): void => {
  console.log('> Starting worker');
  assetAlertsQueue.process(JobNames.AssetAlertsStocks, processStocksAssetAlerts);
  assetAlertsQueue.process(JobNames.AssetAlertsCrypto, processCryptoAssetAlerts);
};

const processStocksAssetAlerts = async ({ data }: { data: Alert[] }) => {
  const stockPrices = await getStockPrices(data.map((alert) => alert.symbol));
  for (const alert of data) {
    await sendAlertIfHit(alert, stockPrices[alert.symbol].latestPrice);
  }
};

const processCryptoAssetAlerts = async ({ data }: { data: Alert[] }) => {
  const stockPrices = await getCryptoPrices(data.map((alert) => alert.symbol));
  for (const alert of data) {
    await sendAlertIfHit(alert, stockPrices[alert.symbol].latestPrice);
  }
};

const sendAlertIfHit = async (alert: Alert, currPrice: number) => {
  if (alert.condition === AlertCondition.Above && currPrice > alert.price) {
    await sendAlertNotification(alert);
  } else if (alert.condition === AlertCondition.Below && currPrice < alert.price) {
    await sendAlertNotification(alert);
  }
};

const sendAlertNotification = async (alert: Alert) => {
  if (alert.destination === AlertDestination.Email) {
    // await sendEmail();
  }
};

startWorker();
