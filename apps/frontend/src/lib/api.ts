import {
  AddAlertRequest,
  AddCashRequest,
  AddCryptoRequest,
  AddCustomAssetRequest,
  AddRealEstateRequest,
  AddStockRequest,
  AddWatchListItemRequest,
  AssetType,
  CheckEmailRequest,
  CheckEmailResponse,
  CreatePortfolioRequest,
  CreatePortfolioResponse,
  CreateUserRequest,
  CreateUserResponse,
  DailyBalancesPeriod,
  EditPortfolioSettingsRequest,
  GetAlertsResponse,
  GetNewsResponse,
  GetPortfolioDailyBalancesResponse,
  GetPortfolioLogItemsResponse,
  GetPortfolioResponse,
  GetPortfolioSettingsResponse,
  GetPortfoliosResponse,
  GetQuoteResponse,
  GetWatchListResponse,
  MeResponse,
  SendContactEmailRequest,
} from 'schema';
import axios from 'axios';
import { PlaidAccount } from 'react-plaid-link';
import firebase from '~/lib/firebase';

// Convert object timestamps from Firestore to Dates
export const normalizeTimestamps = <T>(value: T): T => {
  if (!value) {
    return value;
  }

  return Object.keys(value).reduce((final, key) => {
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
};

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
  // ACCOUNT
  getMe: () => {
    return request<undefined, MeResponse>(`/api/users/me`, 'get');
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
    return request<CheckEmailRequest, CheckEmailResponse>(
      '/api/users/check',
      'post',
      { email },
      false
    );
  },

  sendContactEmail: (name: string, message: string, email?: string) => {
    return request<SendContactEmailRequest, undefined>(
      '/api/users/contact',
      'post',
      { email, message, name },
      false
    );
  },

  updateEmail: (newEmail: string) => {
    return request('/api/users/update-email', 'put', { newEmail });
  },

  updatePassword: (newPassword: string, confirmNewPassword: string) => {
    return request('/api/users/change-password', 'put', { newPassword, confirmNewPassword });
  },

  deleteAccount: () => {
    return request('/api/users/delete', 'delete');
  },

  // PORTFOLIOS
  getPortfolios: () => {
    return request<undefined, GetPortfoliosResponse>('/api/portfolios', 'get');
  },

  getPortfolioLogs: (portfolioID: string) => {
    return request<undefined, GetPortfolioLogItemsResponse>(
      `/api/portfolios/logs/${portfolioID}`,
      'get',
      undefined,
      false
    );
  },

  getPortfolio: (portfolioID: string) => {
    return request<undefined, GetPortfolioResponse>(
      `/api/portfolios/${portfolioID}`,
      'get',
      undefined,
      false
    );
  },

  getPortfolioDailyBalances: (portfolioID: string, period: DailyBalancesPeriod) => {
    return request<undefined, GetPortfolioDailyBalancesResponse>(
      `/api/portfolios/${portfolioID}/daily-balances?period=${period}`,
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

  editPortfolioSettings: (portfolioID: string, data: EditPortfolioSettingsRequest) => {
    return request<EditPortfolioSettingsRequest, undefined>(
      `/api/portfolios/${portfolioID}/settings`,
      'put',
      data
    );
  },

  createPortfolio: (name: string, isPublic: boolean = false) => {
    return request<CreatePortfolioRequest, CreatePortfolioResponse>(
      '/api/portfolios',
      'post',
      { name, public: isPublic }
    );
  },

  deletePortfolio: (portfolioID: string) => {
    return request(`/api/portfolios/${portfolioID}`, 'delete');
  },

  // ADD TO PORTFOLIO
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

  deleteAssetFromPortfolio: (
    positionID: string,
    assetType: AssetType,
    portfolioID: string
  ) => {
    return request<undefined, undefined>(
      `/api/positions/${positionID}?portfolioID=${portfolioID}&assetType=${assetType}`,
      'delete',
      undefined,
      false
    );
  },

  // EDIT POSITIONS

  editStockInPortfolio: (data: Partial<AddStockRequest> & { positionID: string }) => {
    return request<typeof data, undefined>('/api/positions/stock', 'put', data);
  },

  editCryptoInPortfolio: (data: Partial<AddCryptoRequest> & { positionID: string }) => {
    return request<typeof data, undefined>('/api/positions/crypto', 'put', data);
  },

  editRealEstateInPortfolio: (
    data: Partial<AddRealEstateRequest> & { positionID: string }
  ) => {
    return request<typeof data, undefined>('/api/positions/real-estate', 'put', data);
  },

  editCashInPortfolio: (data: AddCashRequest & { positionID: string }) => {
    return request<typeof data, undefined>('/api/positions/cash', 'put', data);
  },

  editCustomInPortfolio: (data: AddCustomAssetRequest & { positionID: string }) => {
    return request<typeof data, undefined>('/api/positions/custom', 'put', data);
  },

  // QUOTES
  getQuote: (objectID: string, symbol: string, type: AssetType) => {
    return request<{ objectID: string; symbol: string; type: AssetType }, GetQuoteResponse>(
      `/api/quotes?symbol=${symbol}&type=${type}&objectID=${objectID ?? 'null'}`,
      'get'
    );
  },

  // WATCHLIST
  getWatchlist: () => {
    return request<undefined, GetWatchListResponse>('/api/watchlist', 'get');
  },

  addAssetToWatchList: (
    symbol: string,
    objectID: string,
    fullName: string,
    assetType: AssetType
  ) => {
    return request<AddWatchListItemRequest, undefined>('/api/watchlist', 'post', {
      symbol,
      fullName,
      objectID,
      assetType,
    });
  },

  removeAssetFromWatchList: (assetID: string) => {
    return request<undefined, undefined>(`/api/watchlist?itemID=${assetID}`, 'delete');
  },

  // ALERTS
  getAlerts: () => {
    return request<undefined, GetAlertsResponse>('/api/alerts', 'get');
  },

  addAlert: (alertData: AddAlertRequest) => {
    return request<AddAlertRequest, undefined>('/api/alerts', 'post', alertData);
  },

  removeAlert: (alertID: string) => {
    return request<undefined, undefined>(`/api/alerts?alertID=${alertID}`, 'delete');
  },

  // NEWS
  getNewsBypage: (pageNumber: number, query?: string) => {
    const url = query
      ? `/api/news?page=${pageNumber}&query=${query}`
      : `/api/news?page=${pageNumber}`;
    return request<undefined, GetNewsResponse>(url, 'get');
  },

  // PLAID
  getPlaidLinkToken: (assetType: AssetType) => {
    return request<undefined, { data: { link_token: string } }>(
      `/api/plaid/create-link-token?assetType=${assetType}`,
      'get'
    );
  },
  exchangeTokenForCashItem: (
    portfolioID: string,
    publicToken: string,
    account: PlaidAccount,
    institutionName: string,
    institutionID: string
  ) => {
    return request(`/api/plaid/cash-item`, 'post', {
      portfolioID,
      publicToken,
      account,
      institutionName,
      institutionID,
    });
  },
  exchangeTokenForStockItem: (
    portfolioID: string,
    publicToken: string,
    account: PlaidAccount,
    institutionName: string,
    institutionID: string
  ) => {
    return request(`/api/plaid/stock-item`, 'post', {
      portfolioID,
      publicToken,
      account,
      institutionName,
      institutionID,
    });
  },

  // BILLING
  createCheckoutSession: () => {
    return request<undefined, { url: string }>('/api/billing/create-checkout-session', 'get');
  },

  createPortalSession: () => {
    return request<undefined, { url: string }>('/api/billing/create-portal-session', 'get');
  },
};
