import { Alert, AlertCondition, AlertDestination } from '@zachweinberg/obsidian-schema';
import { getCryptoPrices } from '~/lib/cmc';
import { sendAssetAlertEmail } from '~/lib/email';
import { getStockPrices } from '~/lib/iex';
import { sendText } from '~/lib/phone';
import { deleteDocument } from '~/utils/db';
import { formatMoneyFromNumber } from '~/utils/money';
import { assetAlertsQueue, JobNames } from '.';

const startWorker = (): void => {
  assetAlertsQueue.process(JobNames.AssetAlertsStocks, processStocksAssetAlerts);
  assetAlertsQueue.process(JobNames.AssetAlertsCrypto, processCryptoAssetAlerts);
  console.log('> [Consumer] Worker online');
};

const processStocksAssetAlerts = async ({ data }: { data: Alert[] }) => {
  console.log(`> [Consumer] Received ${data.length} stock alerts`);

  const stockPrices = await getStockPrices(data.map((alert) => alert.symbol));
  for (const alert of data) {
    await sendAlertIfHit(alert, stockPrices[alert.symbol].latestPrice);
  }
};

const processCryptoAssetAlerts = async ({ data }: { data: Alert[] }) => {
  console.log(`> [Consumer] Received ${data.length} crypto alerts`);

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
    console.log(`> [Consumer] Sending Email...`);
    await sendAssetAlertEmail(alert);
    await deleteAlert(alert.id);
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
    await deleteAlert(alert.id);
  }
};

const deleteAlert = async (alertID: string) => {
  await deleteDocument(`alerts/${alertID}`);
};

startWorker();
