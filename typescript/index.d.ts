export interface User {
    id: string;
    email: string;
    investingExperienceLevel: InvestingExperienceLevel;
    name: string;
    createdAt: Date;
}
export declare enum InvestingExperienceLevel {
    LessThanOneYear = "Less than a year",
    TwoToFiveYears = "Two to five years",
    OverFiveYears = "Over five years"
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
    public: boolean;
    createdAt: Date;
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
    costBasis: number;
}
export interface CryptoPosition extends Position {
    symbol: string;
    coinName: string;
    quantity: number;
    costBasis: number;
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
    investingExperienceLevel: InvestingExperienceLevel;
    email: string;
    password: string;
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
    costBasis: number;
    companyName: string;
    quantity: number;
    note?: string;
}
export interface AddCryptoRequest {
    portfolioID: string;
    symbol: string;
    costBasis: number;
    coinName: string;
    quantity: number;
    note?: string;
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
}
export interface CryptoPositionWithQuote extends CryptoPosition {
    last: number;
    marketValue: number;
    dayChange: number;
    gainLoss: number;
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
    date: string;
    topics: [];
    sentiment: string;
    type: string;
}
