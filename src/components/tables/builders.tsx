import {
  AssetType,
  CashPosition,
  CryptoPositionWithQuote,
  CustomPosition,
  RealEstatePosition,
  RealEstatePropertyType,
  StockPositionWithQuote,
  WatchListItem,
} from '@zachweinberg/obsidian-schema';

// Stocks
export interface StocksTableData {
  id: string;
  companyName: string;
  symbol: string;
  quantity: number;
  marketValue: number;
  dayChange: number;
  costPerShare: number;
  gainLoss: number;
  last: number;
}

export const buildStockData = (stocks: StockPositionWithQuote[]): StocksTableData[] => {
  return stocks.map((stock) => ({
    id: stock.id,
    companyName: stock.companyName,
    symbol: stock.symbol,
    quantity: stock.quantity,
    marketValue: stock.marketValue,
    dayChange: stock.dayChange,
    dayChangePercent: stock.dayChangePercent,
    costPerShare: stock.costPerShare,
    gainLoss: stock.gainLoss,
    last: stock.last,
    gainLossPercent: stock.gainLossPercent,
  }));
};

// Crypto
export interface CryptoTableData {
  coinName: string;
  symbol: string;
  quantity: number;
  marketValue: number;
  id: string;
  dayChange: number;
  costPerCoin: number;
  gainLoss: number;
  last: number;
}

export const buildCryptoData = (crypto: CryptoPositionWithQuote[]): CryptoTableData[] => {
  return crypto.map((crypto) => ({
    coinName: crypto.coinName,
    symbol: crypto.symbol,
    id: crypto.id,
    quantity: crypto.quantity,
    marketValue: crypto.marketValue,
    dayChangePercent: crypto.dayChangePercent,
    dayChange: crypto.dayChange,
    costPerCoin: crypto.costPerCoin,
    gainLoss: crypto.gainLoss,
    last: crypto.last,
    logoURL: crypto.logoURL,
    gainLossPercent: crypto.gainLossPercent,
  }));
};

// Cash
export interface CashTableData {
  accountName: string;
  value: number;
  id: string;
}

export const buildCashData = (cash: CashPosition[]): CashTableData[] => {
  return cash.map((cash) => ({
    id: cash.id,
    accountName: cash.accountName ?? 'Cash account',
    value: cash.amount,
  }));
};

// Real Estate
export interface RealEstateTableData {
  address: string;
  propertyValue: number;
  id: string;
  propertyType: RealEstatePropertyType;
}

export const buildRealEstateData = (
  realEstate: RealEstatePosition[]
): RealEstateTableData[] => {
  return realEstate.map((realEstate) => ({
    id: realEstate.id,
    address: realEstate.address ?? '-',
    propertyValue: realEstate.propertyValue,
    propertyType: realEstate.propertyType,
  }));
};

// Custom
export interface CustomAssetTableData {
  assetName: string;
  id: string;
  value: number;
}

export const buildCustomAssetData = (custom: CustomPosition[]): CustomAssetTableData[] => {
  return custom.map((c) => ({
    id: c.id,
    assetName: c.assetName,
    value: c.value,
  }));
};

export interface WatchlistTableData {
  fullName: string;
  symbol: string;
  last: number;
  assetType: AssetType;
  changePercent: number;
  changeDollars: number;
  marketCap: number;
}

export const buildWatchlistData = (items: WatchListItem[]): WatchlistTableData[] => {
  return items.map((item) => ({
    fullName: item.fullName,
    symbol: item.symbol,
    assetType: item.assetType,
    last: item.latestPrice,
    changePercent: item.changePercent,
    changeDollars: item.changeDollars,
    marketCap: item.marketCap,
  }));
};
