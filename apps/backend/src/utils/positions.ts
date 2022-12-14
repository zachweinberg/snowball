import {
  AssetType,
  CashPosition,
  CryptoPosition,
  CryptoPositionWithQuote,
  CustomPosition,
  DailyBalance,
  Position,
  RealEstatePosition,
  StockPosition,
  StockPositionWithQuote,
} from 'schema';
import currency from 'currency.js';
import { DateTime } from 'luxon';
import { getCryptoPrices } from '~/lib/cmc';
import { getStockPrices } from '~/lib/iex';
import { calculateCurrentMortgageBalance } from '~/lib/valuations';
import {
  calculateCashValue,
  calculateCryptoTotal,
  calculateCustomsValue,
  calculateRealEstateValue,
  calculateStocksTotal,
} from '~/utils/math';
import { findDocuments } from './db';

interface PortfolioValues {
  cashValue: number;
  stocksValue: number;
  cryptoValue: number;
  realEstateValue: number;
  customsValue: number;
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
}

export const calculatePortfolioSummary = async (portfolioID: string): Promise<PortfolioValues> => {
  const assets = await findDocuments<Position>(`/portfolios/${portfolioID}/positions`);
  const realEstatePositions = await findDocuments<RealEstatePosition>(`real-estate-positions`, [
    { property: 'portfolioID', condition: '==', value: portfolioID },
  ]);

  const stockPositions = assets.filter((asset) => asset.assetType === AssetType.Stock) as StockPosition[];
  const cryptoPositions = assets.filter((asset) => asset.assetType === AssetType.Crypto) as CryptoPosition[];
  const cashPositions = assets.filter((asset) => asset.assetType === AssetType.Cash) as CashPosition[];
  const customPositions = assets.filter((asset) => asset.assetType === AssetType.Custom) as CustomPosition[];

  const [stocksValue, cryptoValue] = await Promise.all([
    calculateStocksTotal(stockPositions),
    calculateCryptoTotal(cryptoPositions),
  ]);
  const realEstateValue = await calculateRealEstateValue(realEstatePositions);
  const cashValue = await calculateCashValue(cashPositions);
  const customsValue = await calculateCustomsValue(customPositions);

  const totalValue = currency(stocksValue).add(cryptoValue).add(realEstateValue).add(cashValue).add(customsValue).value;

  const [latestBalanceDoc] = await findDocuments<DailyBalance>(
    `/portfolios/${portfolioID}/dailyBalances`,
    [],
    {
      property: 'date',
      direction: 'desc',
    },
    1
  );

  let dayChange = 0;
  let dayChangePercent = 0;

  if (latestBalanceDoc) {
    dayChange = totalValue - latestBalanceDoc.totalValue;
    dayChangePercent = dayChange / latestBalanceDoc.totalValue;
  }

  return {
    dayChange,
    dayChangePercent,
    stocksValue,
    cryptoValue,
    realEstateValue,
    cashValue,
    customsValue,
    totalValue,
  };
};

export const calculatePortfolioQuotes = async (
  portfolioID: string
): Promise<{
  stocks: StockPositionWithQuote[];
  crypto: CryptoPositionWithQuote[];
  cash: CashPosition[];
  customs: CustomPosition[];
  stocksTotal: number;
  cryptoTotal: number;
  realEstate: RealEstatePosition[];
  realEstateTotal: number;
  cashTotal: number;
  customsTotal: number;
}> => {
  const positions = await findDocuments<Position>(`portfolios/${portfolioID}/positions`);
  const realEstatePositions = await findDocuments<RealEstatePosition>(`/real-estate-positions`, [
    { property: 'portfolioID', condition: '==', value: portfolioID },
  ]);

  const stockPositions = positions.filter((p) => p.assetType === AssetType.Stock) as StockPosition[];
  const cryptoPositions = positions.filter((p) => p.assetType === AssetType.Crypto) as CryptoPosition[];
  const cashPositions = positions.filter((p) => p.assetType === AssetType.Cash) as CashPosition[];
  const customsPositions = positions.filter((p) => p.assetType === AssetType.Custom) as CustomPosition[];

  const [stockPriceMap, cryptoPriceMap] = await Promise.all([
    getStockPrices(stockPositions.map((s) => s.symbol)),
    getCryptoPrices(cryptoPositions.map((c) => c.objectID)),
  ]);

  let stockPositionsWithQuotes: StockPositionWithQuote[] = [];

  for (const stock of stockPositions) {
    if (stockPriceMap[stock.symbol]) {
      const gainLoss = (stockPriceMap[stock.symbol]?.latestPrice ?? 0) * stock.quantity - stock.costPerShare * stock.quantity;

      stockPositionsWithQuotes.push({
        ...stock,
        dayChange: (stockPriceMap[stock.symbol]?.change ?? 0) * stock.quantity,
        dayChangePercent: stockPriceMap[stock.symbol]?.changePercent ?? 0,
        gainLoss,
        gainLossPercent: gainLoss / (stock.costPerShare * stock.quantity),
        marketValue: (stockPriceMap[stock.symbol]?.latestPrice ?? 0) * stock.quantity,
        last: stockPriceMap[stock.symbol]?.latestPrice ?? 0,
      });
    }
  }

  let cryptoPositionsWithQuotes: CryptoPositionWithQuote[] = [];

  for (const coin of cryptoPositions) {
    if (cryptoPriceMap[coin.symbol]) {
      const dayChange = (cryptoPriceMap[coin.symbol]?.changePercent ?? 0) * (coin.costPerCoin * coin.quantity);

      const gainLoss = (cryptoPriceMap[coin.symbol]?.latestPrice ?? 0) * coin.quantity - coin.costPerCoin * coin.quantity;

      cryptoPositionsWithQuotes.push({
        ...coin,
        dayChange,
        dayChangePercent: cryptoPriceMap[coin.symbol]?.changePercent ?? 0,
        gainLoss,
        gainLossPercent: gainLoss / (coin.costPerCoin * coin.quantity),
        marketValue: (cryptoPriceMap[coin.symbol].latestPrice ?? 0) * coin.quantity,
        last: cryptoPriceMap[coin.symbol]?.latestPrice ?? 0,
        logoURL: coin.logoURL ?? '',
      });
    }
  }

  let stocksTotal = currency(0);
  let cryptoTotal = currency(0);
  let realEstateTotal = currency(0);
  let cashTotal = currency(0);
  let customsTotal = currency(0);

  for (const stockPosition of stockPositionsWithQuotes) {
    stocksTotal = stocksTotal.add(stockPosition.marketValue);
  }
  for (const cryptoPosition of cryptoPositionsWithQuotes) {
    cryptoTotal = cryptoTotal.add(cryptoPosition.marketValue);
  }
  for (const realEstatePosition of realEstatePositions) {
    realEstateTotal = realEstateTotal.add(realEstatePosition.propertyValue);
    if (realEstatePosition.mortgage) {
      const endOfMortgage = DateTime.fromMillis(realEstatePosition.mortgage.startDateMs).plus({
        year: realEstatePosition.mortgage.termYears,
      });
      const monthsLeft = Math.abs(DateTime.local().diff(endOfMortgage, 'month').months);
      const remainingBal = calculateCurrentMortgageBalance(
        realEstatePosition.mortgage.monthlyPayment,
        monthsLeft,
        realEstatePosition.mortgage.rate
      );
      realEstateTotal = realEstateTotal.subtract(remainingBal ?? 0);
    }
  }
  for (const cashPosition of cashPositions) {
    cashTotal = cashTotal.add(cashPosition.amount);
  }
  for (const customPosition of customsPositions) {
    customsTotal = customsTotal.add(customPosition.value);
  }

  return {
    stocks: stockPositionsWithQuotes.sort((a, b) => b.marketValue - a.marketValue),
    crypto: cryptoPositionsWithQuotes.sort((a, b) => b.marketValue - a.marketValue),
    cash: cashPositions
      .sort((a, b) => b.amount - a.amount)
      // Remove sensitive plaid ids
      .map((cashPosition) => ({
        accountName: cashPosition.accountName,
        amount: cashPosition.amount,
        assetType: cashPosition.assetType,
        createdAt: cashPosition.createdAt,
        id: cashPosition.id,
        isPlaid: cashPosition.isPlaid,
      })),
    realEstate: realEstatePositions.sort((a, b) => b.propertyValue - a.propertyValue),
    customs: customsPositions.sort((a, b) => b.value - a.value),
    stocksTotal: stocksTotal.value,
    cryptoTotal: cryptoTotal.value,
    realEstateTotal: realEstateTotal.value,
    cashTotal: cashTotal.value,
    customsTotal: customsTotal.value,
  };
};
