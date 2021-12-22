import { Alert, AlertCondition, AlertDestination, AssetType } from '@zachweinberg/obsidian-schema';
import { getCryptoPrices } from '~/lib/cmc';
import { sendAssetAlertEmail } from '~/lib/email';
import { getStockPrices } from '~/lib/iex';
import { sendText } from '~/lib/phone';
import { deleteDocument, fetchDocumentByID } from '~/utils/db';
import { formatMoneyFromNumber } from '~/utils/money';
import { assetAlertsQueue, JobNames } from '.';

const startWorker = (): void => {
  assetAlertsQueue.process(JobNames.AssetAlertsStocks, processAssetAlerts);
  assetAlertsQueue.process(JobNames.AssetAlertsCrypto, processAssetAlerts);
  console.log('> [Consumer] Worker online');
};

const processAssetAlerts = async (job) => {
  const data = job.data;
  const alerts = data.alerts as Alert[];
  const type = data.type as AssetType;

  console.log(`> [Consumer] Received ${alerts.length} ${type} alerts`);

  // Ensure docs exist
  for (let i = 0; i < alerts.length; i++) {
    try {
      await fetchDocumentByID('alerts', alerts[i].id);
    } catch (err) {
      alerts.splice(i, 1);
    }
  }

  let prices = {};

  if (type === AssetType.Stock) {
    prices = await getStockPrices(alerts.map((alert) => alert.symbol));
  } else if (type === AssetType.Crypto) {
    prices = await getCryptoPrices(alerts.map((alert) => alert.symbol));
  }

  for (const alert of alerts) {
    await sendAlertIfHit(alert, prices[alert.symbol]?.latestPrice);
  }
};

const sendAlertIfHit = async (alert: Alert, currPrice?: number) => {
  if (!currPrice) return;

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
