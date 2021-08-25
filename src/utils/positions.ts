import {
  AssetType,
  CashPosition,
  CryptoPosition,
  CustomPosition,
  Position,
  RealEstatePosition,
  StockPosition,
} from '@zachweinberg/wealth-schema';
import currency from 'currency.js';
import { findDocuments } from './db';
import {
  calculateCashValue,
  calculateCryptoTotal,
  calculateCustomsValue,
  calculateRealEstateValue,
  calculateStocksTotal,
} from './math';

interface PortfolioValues {
  cashValue: number;
  stocksValue: number;
  cryptoValue: number;
  realEstateValue: number;
  customsValue: number;
  totalValue: number;
}

export const calculatePortfolioValues = async (portfolioID: string): Promise<PortfolioValues> => {
  const assets = await findDocuments<Position>(`/portfolios/${portfolioID}/positions`);

  const stocks = assets.filter((asset) => asset.assetType === AssetType.Stock) as StockPosition[];
  const crypto = assets.filter((asset) => asset.assetType === AssetType.Crypto) as CryptoPosition[];
  const realEstate = assets.filter((asset) => asset.assetType === AssetType.RealEstate) as RealEstatePosition[];
  const cash = assets.filter((asset) => asset.assetType === AssetType.Cash) as CashPosition[];
  const customs = assets.filter((asset) => asset.assetType === AssetType.Cash) as CustomPosition[];

  const [stocksValue, cryptoValue] = await Promise.all([calculateStocksTotal(stocks), calculateCryptoTotal(crypto)]);
  const realEstateValue = await calculateRealEstateValue(realEstate);
  const cashValue = await calculateCashValue(cash);
  const customsValue = await calculateCustomsValue(customs);

  const totalValue = currency(stocksValue).add(cryptoValue).add(realEstateValue).add(cashValue).add(customsValue).value;

  return {
    stocksValue,
    cryptoValue,
    realEstateValue,
    cashValue,
    customsValue,
    totalValue,
  };
};
