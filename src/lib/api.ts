import {
  AddCashRequest,
  AddCryptoRequest,
  AddCustomAssetRequest,
  AddRealEstateRequest,
  AddStockRequest,
  AddWatchListItemRequest,
  AssetType,
  CheckVerificationTokenRequest,
  CheckVerificationTokenResponse,
  CreatePortfolioRequest,
  CreatePortfolioResponse,
  CreateUserRequest,
  CreateUserResponse,
  EditPortfolioSettingsRequest,
  GetNewsResponse,
  GetPortfolioResponse,
  GetPortfolioSettingsResponse,
  GetPortfoliosResponse,
  GetQuoteResponse,
  GetWatchListResponse,
  MeResponse,
  PortfolioSettings,
  SendContactEmailRequest,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '@zachweinberg/obsidian-schema';
import axios from 'axios';
import firebase from '~/lib/firebase';

// Convert object timestamps from Firestore to Dates
const normalizeTimestamps = <T>(value: T): T =>
  Object.keys(value).reduce((final, key) => {
    let finalValue;

    if (value[key] !== null && typeof value[key] === 'object' && value[key]._seconds) {
      finalValue = new Date(value[key]._seconds * 1000);
    } else if (
      value[key] !== null &&
      typeof value[key] === 'object' &&
      !Array.isArray(value[key])
    ) {
      finalValue = normalizeTimestamps(value[key]);
    } else if (Array.isArray(value[key])) {
      finalValue = value[key].map(normalizeTimestamps);
    } else {
      finalValue = value[key];
    }
    return {
      ...final,
      [key]: finalValue,
    };
  }, {} as T);

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use((response) => {
  response.data = normalizeTimestamps(response.data);
  return response;
});

export const request = async <T, K>(
  path: string,
  method: 'put' | 'post' | 'get' | 'delete',
  body?: T,
  requireAuth: boolean = true
): Promise<K> => {
  try {
    let headers = {};

    const token = await firebase.auth().currentUser?.getIdToken();

    if (!token) {
      if (requireAuth) {
        console.error(`Error in: API request - token is ${token}`);
        console.error(`This error occured while trying to request [${method}] ${path}`);
        throw new Error('Unable to authenticate user for API request');
      }
    } else {
      headers['Authorization'] = `Bearer ${token}`;
    }

    method = method || 'post';

    const url = `${process.env.NEXT_PUBLIC_API_BASE_PATH}${path}`;

    const response = await axiosInstance.request<K>({
      url,
      method,
      headers,
      data: body,
    });

    return response.data;
  } catch (err) {
    console.error('--- HTTP ERROR ---');
    console.error(err);
    throw err;
  }
};

export const API = {
  getMe: () => {
    return request<undefined, MeResponse>(`/api/users/me`, 'get');
  },
  resendVerificationEmail: () => {
    return request<undefined, undefined>('/api/users/resend-email', 'post');
  },
  checkVerificationToken: (token: string, userID: string) => {
    return request<CheckVerificationTokenRequest, CheckVerificationTokenResponse>(
      '/api/users/check-verification-token',
      'post',
      { token, userID },
      false
    );
  },
  createUser: (userData: CreateUserRequest) => {
    return request<CreateUserRequest, CreateUserResponse>(
      '/api/users',
      'post',
      userData,
      false
    );
  },
  checkEmailExists: (email: string) => {
    return request<VerifyEmailRequest, VerifyEmailResponse>(
      '/api/users/check',
      'post',
      { email },
      false
    );
  },
  getPortfolios: () => {
    return request<undefined, GetPortfoliosResponse>('/api/portfolios', 'get');
  },
  getPortfolio: (portfolioID: string) => {
    return request<undefined, GetPortfolioResponse>(
      `/api/portfolios/${portfolioID}`,
      'get',
      undefined,
      false
    );
  },
  getPortfolioSettings: (portfolioID: string) => {
    return request<undefined, GetPortfolioSettingsResponse>(
      `/api/portfolios/${portfolioID}/settings`,
      'get'
    );
  },
  editPortfolioSettings: (portfolioID: string, settings: PortfolioSettings) => {
    return request<EditPortfolioSettingsRequest, undefined>(
      `/api/portfolios/${portfolioID}/settings`,
      'put',
      { settings }
    );
  },
  createPortfolio: (name: string, isPublic: boolean = false) => {
    return request<CreatePortfolioRequest, CreatePortfolioResponse>(
      '/api/portfolios',
      'post',
      { name, public: isPublic }
    );
  },
  addStockToPortfolio: (stockData: AddStockRequest) => {
    return request<AddStockRequest, undefined>('/api/positions/stock', 'post', stockData);
  },
  addCryptoToPortfolio: (coinData: AddCryptoRequest) => {
    return request<AddCryptoRequest, undefined>('/api/positions/crypto', 'post', coinData);
  },
  addCashToPortfolio: (cashData: AddCashRequest) => {
    return request<AddCashRequest, undefined>('/api/positions/cash', 'post', cashData);
  },
  addRealEstateToPortfolio: (realEstateData: AddRealEstateRequest) => {
    return request<AddRealEstateRequest, undefined>(
      '/api/positions/real-estate',
      'post',
      realEstateData
    );
  },
  addCustomAssetToPortfolio: (customAssetData: AddCustomAssetRequest) => {
    return request<AddCustomAssetRequest, undefined>(
      '/api/positions/custom',
      'post',
      customAssetData
    );
  },
  getQuote: (symbol: string, type: AssetType) => {
    return request<{ symbol: string; type: AssetType }, GetQuoteResponse>(
      `/api/quotes?symbol=${symbol}&type=${type}`,
      'get'
    );
  },
  getWatchlist: () => {
    return request<undefined, GetWatchListResponse>('/api/watchlist', 'get');
  },
  addAssetToWatchList: (symbol: string, fullName: string, assetType: AssetType) => {
    return request<AddWatchListItemRequest, undefined>('/api/watchlist', 'post', {
      symbol,
      fullName,
      assetType,
    });
  },
  deleteAssetFromPortfolio: (positionID: string, portfolioID: string) => {
    return request<undefined, undefined>(
      `/api/positions/${positionID}?portfolioID=${portfolioID}`,
      'delete',
      undefined,
      false
    );
  },
  getNewsBypage: (pageNumber: number, symbol?: string) => {
    const url = symbol
      ? `/api/news?page=${pageNumber}&symbol=${symbol}`
      : `/api/news?page=${pageNumber}`;
    return request<undefined, GetNewsResponse>(url, 'get');
  },
  sendContactEmail: (name: string, message: string, email?: string) => {
    return request<SendContactEmailRequest, undefined>(
      '/api/users/contact',
      'post',
      { email, message, name },
      false
    );
  },
};
