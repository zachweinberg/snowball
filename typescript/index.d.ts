export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    verified: boolean;
    verificationCode?: string;
}
export declare enum AssetColor {
    Stocks = "#CEF33C",
    Crypto = "#6600E8",
    Cash = "#4E5B00",
    Custom = "#72CB00",
    RealEstate = "#00565B"
}
export interface Portfolio {
    id: string;
    userID: string;
    name: string;
    createdAt: Date;
    settings: PortfolioSettings;
}
export declare type PortfolioWithBalances = Portfolio & {
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
export declare enum AssetType {
    Stock = "Stock",
    RealEstate = "Real Estate",
    Crypto = "Crypto",
    Cash = "Cash",
    Custom = "Custom"
}
export interface Position {
    id: string;
    assetType: AssetType;
    createdAt: Date;
    note?: string;
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
    logoURL?: string;
}
export declare enum RealEstatePropertyType {
    SingleFamily = "Single family home",
    MultiFamily = "Multi-family home",
    Condo = "Condo",
    Apartment = "Apartment",
    Commercial = "Commercial",
    Storage = "Storage facility",
    Other = "Other"
}
export interface RealEstatePosition extends Position {
    address?: string;
    thirdPartyData: boolean;
    propertyValue: number;
    propertyType: RealEstatePropertyType;
}
export interface CashPosition extends Position {
    amount: number;
    accountName?: string;
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
export interface SendContactEmailRequest {
    name: string;
    email?: string;
    message: string;
}
export interface CreateUserResponse extends BaseResponse {
    user: User;
}
export interface CheckVerificationTokenRequest {
    token: string;
    userID: string;
}
export interface CheckVerificationTokenResponse extends BaseResponse {
    verified: boolean;
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
export interface GetPortfolioResponse extends BaseResponse {
    portfolio: PortfolioWithQuotes;
}
export interface MeResponse extends BaseResponse {
    me: User;
}
export interface VerifyEmailRequest {
    email: string;
}
export interface VerifyEmailResponse extends BaseResponse {
    email: string;
}
export interface AddStockRequest {
    portfolioID: string;
    symbol: string;
    costPerShare: number;
    companyName: string;
    quantity: number;
    note?: string;
}
export interface AddCryptoRequest {
    portfolioID: string;
    symbol: string;
    costPerCoin: number;
    coinName: string;
    quantity: number;
    note?: string;
    logoURL?: string;
}
export interface AddRealEstateRequest {
    portfolioID: string;
    propertyValue: number;
    propertyType: RealEstatePropertyType;
    address?: string;
    thirdPartyData: boolean;
    note?: string;
}
export interface AddCashRequest {
    portfolioID: string;
    amount: number;
    accountName: string;
    note?: string;
}
export interface AddCustomAssetRequest {
    portfolioID: string;
    value: number;
    assetName: string;
    note?: string;
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
    dailyBalances: DailyBalance[];
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
    settings: PortfolioSettings;
}
export interface WatchListItem {
    assetType: AssetType;
    symbol: string;
    latestPrice: number;
    changePercent: number;
    changeDollars: number;
    fullName: string;
    dateAdded: Date;
}
export interface GetWatchListResponse extends BaseResponse {
    stocks: Array<WatchListItem>;
    crypto: Array<WatchListItem>;
}
export interface GetNewsResponse extends BaseResponse {
    news: NewsItem[];
}
export interface AddWatchListItemRequest {
    symbol: string;
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
export declare enum Destination {
    Email = "Email",
    SMS = "SMS"
}
export interface Alert {
    assetType: AssetType;
    symbol: string;
    fullName: string;
    condition: "Above" | "Below";
    price: number;
    destination: Destination;
    destinationValue: string;
}
export declare enum Unit {
    Dollars = "Dollars",
    Percents = "Percents"
}
export declare enum Period {
    Daily = "Daily",
    Weekly = "Weekly",
    Monthly = "Monthly"
}
export interface PortfolioSettings {
    private: boolean;
    defaultAssetType: AssetType;
    reminderEmailPeriod: Period;
    summaryEmailPeriod: Period;
}
