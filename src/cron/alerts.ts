import { Alert, AlertCondition, AlertDestination, AssetType } from '@zachweinberg/obsidian-schema';
import _ from 'lodash';
import { getCryptoPrices } from '~/lib/cmc';
import { sendEmail } from '~/lib/email';
import { getStockPrices } from '~/lib/iex';
import { findDocuments } from '~/utils/db';

export const processAlerts = async () => {
  const alerts = await findDocuments<Alert>('alerts');

  const chunks = _.chunk(alerts, 15);

  for (const chunk of chunks) {
    const stockSymbols = chunk.filter((alert) => alert.assetType === AssetType.Stock).map((a) => a.symbol);
    const cryptoSymbols = chunk.filter((alert) => alert.assetType === AssetType.Crypto).map((a) => a.symbol);

    const [stocksPriceMap, cryptoPriceMap] = await Promise.all([
      getStockPrices(stockSymbols),
      getCryptoPrices(cryptoSymbols),
    ]);

    const promises = [];

    for (const alert of chunk) {
      const currPrice =
        alert.assetType === AssetType.Stock
          ? stocksPriceMap[alert.symbol]?.latestPrice
          : alert.assetType === AssetType.Crypto
          ? cryptoPriceMap[alert.symbol]?.latestPrice
          : null;

      if (!currPrice) {
        continue;
      }

      if (alert.condition === AlertCondition.Above && currPrice > alert.price) {
        await sendAlertNotification(alert);
      } else if (alert.condition === AlertCondition.Below && currPrice < alert.price) {
        await sendAlertNotification(alert);
      }
    }
  }
};

const sendAlertNotification = async (alert: Alert) => {
  if (alert.destination === AlertDestination.Email) {
    await sendEmail(
      alert.destinationValue,
      `${alert.symbol} is ${alert.condition.toLowerCase()} ${formatMoneyFromNumber(alert.price)}`,
      'hi',
      'hey',
      'alerts'
    );
  } else if (alert.destination === AlertDestination.SMS) {
  }
};

const formatMoneyFromNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    maximumFractionDigits: value.toString().includes('.00') ? 8 : 2, // For numbers that are below a penny, show 8 decimals
    currency: 'USD',
  }).format(value);
};
