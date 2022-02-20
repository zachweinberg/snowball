export enum DailyBalancesPeriod {
  OneDay = "OneDay",
  OneWeek = "OneWeek",
  OneMonth = "OneMonth",
  SixMonths = "SixMonths",
  OneYear = "OneYear",
  AllTime = "AllTime",
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  plan: Plan;
  lastLogin: Date;
}

export enum PlanType {
  FREE = "FREE",
  PREMIUM = "PREMIUM",
}
export interface Plan {
  type: PlanType;
  planUpdatedAt: Date;
  stripeCustomerID: string | null;
  stripeSubscriptionID: string | null;
}

export enum AssetColor {
  Stocks = "#CEF33C",
  Crypto = "#6600E8",
  Cash = "#4E5B00",
  Custom = "#72CB00",
  RealEstate = "#00565B",
}

export interface Portfolio {
  id: string;
  userID: string;
  name: string;
  createdAt: Date;
  settings: PortfolioSettings;
}

export type PortfolioWithBalances = Portfolio & {
  totalValue: number;
  dayChangePercent: number;
  dayChange: number;
  stocksValue: number;
  cryptoValue: number;
  realEstateValue: number;
  cashValue: number;
  customsValue: number;
  dailyBalances: DailyBalance[];
};

export enum AssetType {
  Stock = "Stock",
  RealEstate = "Real Estate",
  Crypto = "Crypto",
  Cash = "Cash",
  Custom = "Custom",
}
export interface Position {
  id: string;
  assetType: AssetType;
  createdAt: Date;
}

export interface StockPosition extends Position {
  symbol: string;
  companyName: string;
  quantity: number;
  costPerShare: number;
}

export interface CryptoPosition extends Position {
  symbol: string;
  coinName: string;
  quantity: number;
  costPerCoin: number;
  objectID: string;
  logoURL?: string;
}

export enum RealEstatePropertyType {
  SingleFamily = "Single family home",
  MultiFamily = "Multi-family home",
  Condo = "Condo",
  Apartment = "Apartment",
  Commercial = "Commercial",
  Storage = "Storage facility",
  Other = "Other",
}
export interface RealEstatePosition extends Position {
  name: string;
  id: string;
  address: Address;
  automaticValuation: boolean;
  googlePlaceID: string;
  propertyType: RealEstatePropertyType;
  propertyValue: number;
  createdAt: Date;
  portfolioID: string;
  mortgage: Mortgage | null;
}

export interface Mortgage {
  startDateMs: number;
  termYears: number;
  rate: number;
  monthlyPayment: number;
}

export interface CashPosition extends Position {
  amount: number;
  accountName?: string;
  isPlaid: boolean;
  plaidItemID?: string;
  plaidAccountID?: string;
}

export interface CustomPosition extends Position {
  assetName: string;
  value: number;
}

export interface BaseResponse {
  status: "ok" | "error";
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface GetPlaidTokenResponse extends BaseResponse {
  data: {
    expiration: string;
    link_token: string;
    request_id: string;
  };
}

export interface GetPortfolioLogItemsResponse extends BaseResponse {
  logItems: PortfolioLogItem[];
}

export interface ExchangePlaidTokenRequest {
  publicToken: string;
}

export interface SendContactEmailRequest {
  name: string;
  email?: string;
  message: string;
}

export interface CreateUserResponse extends BaseResponse {
  user: User;
}

export interface CreatePortfolioRequest {
  name: string;
  public: boolean;
}

export interface CreatePortfolioResponse extends BaseResponse {
  portfolio: Portfolio;
}

export interface GetPortfoliosResponse extends BaseResponse {
  portfolios: PortfolioWithBalances[];
}

export interface GetPortfolioDailyBalancesResponse extends BaseResponse {
  dailyBalances: DailyBalance[];
}
export interface GetPortfolioResponse extends BaseResponse {
  portfolio: PortfolioWithQuotes;
}

export interface MeResponse extends BaseResponse {
  me: User;
}

export interface AddStockRequest {
  portfolioID: string;
  symbol: string;
  objectID: string;
  costPerShare: number;
  companyName: string;
  quantity: number;
}

export interface AddCryptoRequest {
  portfolioID: string;
  symbol: string;
  costPerCoin: number;
  coinName: string;
  objectID: string;
  quantity: number;
  logoURL?: string;
}

export interface AddRealEstateRequest {
  name: string;
  automaticValuation: boolean;
  portfolioID: string;
  apt: string | null;
  propertyValue: number | null;
  propertyType: RealEstatePropertyType;
  placeID: string | null;
  mortgage: Mortgage | null;
}

export interface AddCashRequest {
  portfolioID: string;
  amount: number;
  accountName: string;
}

export interface AddCustomAssetRequest {
  portfolioID: string;
  value: number;
  assetName: string;
}

export interface PortfolioValues {
  cashValue: number;
  stocksValue: number;
  cryptoValue: number;
  realEstateValue: number;
  customsValue: number;
  totalValue: number;
}

export interface DailyBalance extends PortfolioValues {
  date: Date;
}

export interface StockPositionWithQuote extends StockPosition {
  last: number;
  marketValue: number;
  dayChange: number;
  gainLoss: number;
  dayChangePercent: number;
  gainLossPercent: number;
}

export interface CryptoPositionWithQuote extends CryptoPosition {
  last: number;
  marketValue: number;
  dayChange: number;
  gainLoss: number;
  dayChangePercent: number;
  gainLossPercent: number;
}

export interface PortfolioWithQuotes extends Portfolio {
  stocks: StockPositionWithQuote[];
  crypto: CryptoPositionWithQuote[];
  cash: CashPosition[];
  realEstate: RealEstatePosition[];
  customs: CustomPosition[];
  cashTotal: number;
  realEstateTotal: number;
  cryptoTotal: number;
  stocksTotal: number;
  customsTotal: number;
}

export interface GetQuoteResponse extends BaseResponse {
  symbol: string;
  latestPrice: number;
  changePercent: number;
  changeDollars: number;
}

export interface GetPortfolioSettingsResponse extends BaseResponse {
  portfolio: Portfolio;
}

export interface EditPortfolioSettingsRequest {
  name: string;
  settings: PortfolioSettings;
}
export interface WatchListItem {
  assetType: AssetType;
  symbol: string;
  marketCap: number;
  objectID: string;
  latestPrice: number;
  changePercent: number;
  changeDollars: number;
  fullName: string;
  createdAt: Date;
  id: string;
}

export interface GetWatchListResponse extends BaseResponse {
  stocks: Array<WatchListItem>;
  crypto: Array<WatchListItem>;
}

export interface GetAlertsResponse extends BaseResponse {
  alerts: Array<Alert>;
}
export interface GetNewsResponse extends BaseResponse {
  news: NewsItem[];
}

export interface AddAlertRequest {
  assetType: AssetType;
  condition: AlertCondition;
  price: number;
  symbol: string;
  objectID: string;
  destination: AlertDestination;
  destinationValue: string;
}
export interface AddWatchListItemRequest {
  symbol: string;
  objectID: string;
  fullName: string;
  assetType: AssetType;
}
export interface NewsItem {
  newsURL: string;
  imageURL: string;
  title: string;
  text: string;
  sourceName: string;
  date: Date;
  topics: [];
  sentiment: string;
  type: string;
}

export enum AlertDestination {
  Email = "Email",
  SMS = "SMS",
}

export enum AlertCondition {
  Above = "Above",
  Below = "Below",
}

export enum AlertMode {
  FireAndDelete = "FireAndDelete",
  Repeat = "Repeat",
}
export interface Alert {
  id: string;
  assetType: AssetType;
  symbol: string;
  fullName: string;
  userID: string;
  objectID: string;
  condition: AlertCondition;
  price: number;
  destination: AlertDestination;
  destinationValue: string;
  createdAt: Date;
}

export enum Unit {
  Dollars = "Dollars",
  Percents = "Percents",
}

export enum Period {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Never = "Never",
}
export interface PortfolioSettings {
  private: boolean;
  defaultAssetType: AssetType;
  summaryEmailPeriod: Period;
}

export type PlaidItemStatus = "GOOD" | "BAD";
export interface PlaidItem {
  plaidItemID: string;
  userID: string;
  plaidInstitutionName: string;
  createdAt: Date;
  portfolioID: string;
  plaidAccessToken: string;
  plaidInstitutionID: string;
  status: PlaidItemStatus;
  forAssetType: AssetType;
}

export interface PlaidAccount {
  plaidItemID: string;
  plaidAccountID: string;
  name: string;
  currentBalance: number;
  subtype: string;
  type: string;
  userID: string;
  forAssetType: AssetType;
  positionID: string;
  portfolioID: string;
  createdAt: Date;
}

export interface PortfolioLogItem {
  portfolioID: string;
  description: string;
  createdAt: number;
}

export interface Address {
  state: string;
  street: string;
  zip: string;
  city: string;
  apt?: string;
}

export interface GetGooglePlaceAddressResponse extends BaseResponse {
  address: Address | null;
}

export interface CheckEmailRequest {
  email: string;
}

export interface CheckEmailResponse extends BaseResponse {
  email: string;
}

export interface FoundPlaidAsset {
  assetType: AssetType;
  plaidItemID: string;
}

export const PLAN_LIMITS = {
  portfolios: {
    free: 1,
    premium: 4,
  },
  watchlist: {
    free: 6,
    premium: 30,
  },
  alerts: {
    free: 3,
    premium: 20,
  },
  stocks: {
    free: 4,
    premium: 30,
  },
  crypto: {
    free: 4,
    premium: 30,
  },
  realEstate: {
    free: 2,
    premium: 20,
  },
  cash: {
    free: 4,
    premium: 30,
  },
  custom: {
    free: 4,
    premium: 30,
  },
};
