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
} from '@zachweinberg/wealth-schema';
import currency from 'currency.js';
import { getCryptoPrices } from '~/lib/cmc';
import { getStockPrices } from '~/lib/iex';
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

  const stocks = assets.filter((asset) => asset.assetType === AssetType.Stock) as StockPosition[];
  const crypto = assets.filter((asset) => asset.assetType === AssetType.Crypto) as CryptoPosition[];
  const realEstate = assets.filter((asset) => asset.assetType === AssetType.RealEstate) as RealEstatePosition[];
  const cash = assets.filter((asset) => asset.assetType === AssetType.Cash) as CashPosition[];
  const customs = assets.filter((asset) => asset.assetType === AssetType.Custom) as CustomPosition[];

  const [stocksValue, cryptoValue] = await Promise.all([calculateStocksTotal(stocks), calculateCryptoTotal(crypto)]);
  const realEstateValue = await calculateRealEstateValue(realEstate);
  const cashValue = await calculateCashValue(cash);
  const customsValue = await calculateCustomsValue(customs);

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
  realEstate;
  realEstateTotal: number;
  cashTotal: number;
  customsTotal: number;
}> => {
  const positions = await findDocuments<Position>(`portfolios/${portfolioID}/positions`);

  const stockPositions = positions.filter((p) => p.assetType === AssetType.Stock) as StockPosition[];
  const cryptoPositions = positions.filter((p) => p.assetType === AssetType.Crypto) as CryptoPosition[];
  const realEstatePositions = positions.filter((p) => p.assetType === AssetType.RealEstate) as RealEstatePosition[];
  const cashPositions = positions.filter((p) => p.assetType === AssetType.Cash) as CashPosition[];
  const customsPositions = positions.filter((p) => p.assetType === AssetType.Custom) as CustomPosition[];

  const [stockPriceMap, cryptoPriceMap] = await Promise.all([
    getStockPrices(stockPositions.map((s) => s.symbol)),
    getCryptoPrices(cryptoPositions.map((s) => s.symbol)),
  ]);

  let stockPositionsWithQuotes: StockPositionWithQuote[] = [];

  for (const stock of stockPositions) {
    if (stockPriceMap[stock.symbol]) {
      stockPositionsWithQuotes.push({
        ...stock,
        dayChange: (stockPriceMap[stock.symbol]?.change ?? 0) * stock.quantity,
        gainLoss: (stockPriceMap[stock.symbol]?.latestPrice ?? 0) * stock.quantity - stock.costBasis * stock.quantity,
        marketValue: (stockPriceMap[stock.symbol]?.latestPrice ?? 0) * stock.quantity,
        last: stockPriceMap[stock.symbol]?.latestPrice ?? 0,
      });
    }
  }

  let cryptoPositionsWithQuotes: CryptoPositionWithQuote[] = [];

  for (const coin of cryptoPositions) {
    if (cryptoPriceMap[coin.symbol]) {
      cryptoPositionsWithQuotes.push({
        ...coin,
        dayChange:
          (1 + (cryptoPriceMap[coin.symbol]?.changePercent ?? 0) / 100) *
          (cryptoPriceMap[coin.symbol]?.latestPrice ?? 0) *
          coin.quantity,
        gainLoss: (cryptoPriceMap[coin.symbol]?.latestPrice ?? 0) * coin.quantity - coin.costBasis * coin.quantity,
        marketValue: (cryptoPriceMap[coin.symbol].latestPrice ?? 0) * coin.quantity,
        last: cryptoPriceMap[coin.symbol]?.latestPrice ?? 0,
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
  }
  for (const cashPosition of cashPositions) {
    cashTotal = cashTotal.add(cashPosition.amount);
  }
  for (const customPosition of customsPositions) {
    customsTotal = customsTotal.add(customPosition.value);
  }

  return {
    stocks: stockPositionsWithQuotes,
    crypto: cryptoPositionsWithQuotes,
    cash: cashPositions,
    realEstate: [],
    customs: [],
    stocksTotal: stocksTotal.value,
    cryptoTotal: cryptoTotal.value,
    realEstateTotal: realEstateTotal.value,
    cashTotal: cashTotal.value,
    customsTotal: customsTotal.value,
  };
};
