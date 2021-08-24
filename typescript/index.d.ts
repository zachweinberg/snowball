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
export interface Portfolio {
    id: string;
    userID: string;
    name: string;
    public: boolean;
    createdAt: Date;
}
export declare type PortfolioWithBalances = Portfolio & {
    totalValue: number;
    totalPercentChange: number;
    stocksValue: number;
    cryptoValue: number;
    realEstateValue: number;
    cashValue: number;
    customsValue: number;
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
    propertyType: RealEstatePropertyType;
    estimatedAppreciationRate: number;
}
export interface CashPosition extends Position {
    amount: number;
    accountName?: string;
}
export interface CustomPosition extends Position {
    name: string;
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
    portfolio: Portfolio;
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
    quantity: number;
    note?: string;
}
