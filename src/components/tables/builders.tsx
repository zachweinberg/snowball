import {
  Address,
  Alert,
  AlertCondition,
  AlertDestination,
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
  assetType: AssetType;
  costPerShare: number;
  gainLoss: number;
  last: number;
}

export const buildStockData = (stocks: StockPositionWithQuote[]): StocksTableData[] => {
  return stocks.map((stock) => ({
    assetType: AssetType.Stock,
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
  assetType: AssetType;
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
    assetType: AssetType.Crypto,
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
  assetType: AssetType;
  id: string;
}

export const buildCashData = (cash: CashPosition[]): CashTableData[] => {
  return cash.map((cash) => ({
    id: cash.id,
    assetType: AssetType.Cash,
    accountName: cash.accountName ?? 'Cash account',
    value: cash.amount,
    isPlaid: cash.isPlaid,
    createdAt: cash.createdAt,
  }));
};

// Real Estate
export interface RealEstateTableData {
  address: Address | null;
  propertyValue: number;
  assetType: AssetType;
  id: string;
  propertyType: RealEstatePropertyType;
}

export const buildRealEstateData = (
  realEstate: RealEstatePosition[]
): RealEstateTableData[] => {
  return realEstate.map((realEstate) => ({
    id: realEstate.id,
    assetType: AssetType.RealEstate,
    address: realEstate.address ?? null,
    propertyValue: realEstate.propertyValue,
    propertyType: realEstate.propertyType,
    automaticValuation: realEstate.automaticValuation,
  }));
};

// Custom
export interface CustomAssetTableData {
  assetName: string;
  id: string;
  assetType: AssetType;
  value: number;
}

export const buildCustomAssetData = (custom: CustomPosition[]): CustomAssetTableData[] => {
  return custom.map((c) => ({
    id: c.id,
    assetType: AssetType.Custom,
    assetName: c.assetName,
    value: c.value,
    createdAt: c.createdAt,
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
    id: item.id,
    fullName: item.fullName,
    symbol: item.symbol,
    assetType: item.assetType,
    last: item.latestPrice,
    changePercent: item.changePercent,
    changeDollars: item.changeDollars,
    marketCap: item.marketCap,
  }));
};

export interface AlertsTableData {
  id: string;
  destination: AlertDestination;
  symbol: string;
  condition: AlertCondition;
  price: number;
}

export const buildAlertsData = (alerts: Alert[]): AlertsTableData[] => {
  return alerts.map((alert) => ({
    id: alert.id,
    destination: alert.destination,
    symbol: alert.symbol,
    condition: alert.condition,
    price: alert.price,
    destinationValue: alert.destinationValue,
  }));
};
