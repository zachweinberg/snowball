import { InvestingExperienceLevel, Portfolio, User } from './models';

export interface BaseResponse {
  status: 'ok' | 'error';
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
  portfolios: Portfolio[];
}

export interface MeResponse extends BaseResponse {
  me: User;
}
