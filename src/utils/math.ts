import { CashPosition, CryptoPosition, CustomPosition, RealEstatePosition, StockPosition } from '@zachweinberg/obsidian-schema';
import currency from 'currency.js';
import { DateTime } from 'luxon';
import { getCryptoPrices } from '~/lib/cmc';
import { getStockPrices } from '~/lib/iex';
import { calculateCurrentMortgageBalance } from '~/lib/valuations';

export const calculateStocksTotal = async (stockPositions: StockPosition[]): Promise<number> => {
  if (stockPositions.length === 0) {
    return 0;
  }

  const symbols = stockPositions.map((position) => position.symbol);
  const priceMap = await getStockPrices(symbols);

  let total = currency(0);

  for (const stockPosition of stockPositions) {
    if (priceMap[stockPosition.symbol]) {
      total = total.add((priceMap[stockPosition.symbol]?.latestPrice ?? 0) * stockPosition.quantity);
    }
  }

  return total.value;
};

export const calculateCryptoTotal = async (cryptoPositions: CryptoPosition[]): Promise<number> => {
  if (cryptoPositions.length === 0) {
    return 0;
  }

  const symbols = cryptoPositions.map((position) => position.symbol);
  const priceMap = await getCryptoPrices(symbols);

  let total = currency(0);

  for (const cryptoPosition of cryptoPositions) {
    if (priceMap[cryptoPosition.symbol]) {
      total = total.add((priceMap[cryptoPosition.symbol].latestPrice ?? 0) * cryptoPosition.quantity);
    }
  }

  return total.value;
};

export const calculateRealEstateValue = (realEstatePositions: RealEstatePosition[]): number => {
  if (realEstatePositions.length === 0) {
    return 0;
  }

  let total = currency(0);

  for (const position of realEstatePositions) {
    if (position.propertyValue) {
      total = total.add(position.propertyValue);
    }

    if (position.mortgage) {
      const endOfMortgage = DateTime.fromMillis(position.mortgage.startDateMs).plus({ year: position.mortgage.termYears });
      const monthsLeft = Math.abs(DateTime.local().diff(endOfMortgage, 'month').months);
      const remainingBal = calculateCurrentMortgageBalance(position.mortgage.monthlyPayment, monthsLeft, position.mortgage.rate);
      total = total.subtract(remainingBal ?? 0);
    }
  }

  return total.value;
};

export const calculateCashValue = (cashPositions: CashPosition[]): number => {
  if (cashPositions.length === 0) {
    return 0;
  }

  let total = currency(0);

  for (const cashPosition of cashPositions) {
    if (cashPosition.amount) {
      total = total.add(cashPosition.amount);
    }
  }

  return total.value;
};

export const calculateCustomsValue = (customPositions: CustomPosition[]): number => {
  if (customPositions.length === 0) {
    return 0;
  }

  let total = currency(0);

  for (const customPosition of customPositions) {
    if (customPosition.value) {
      total = total.add(customPosition.value);
    }
  }

  return total.value;
};
