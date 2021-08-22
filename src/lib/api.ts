import {
  CreatePortfolioRequest,
  CreatePortfolioResponse,
  CreateUserRequest,
  CreateUserResponse,
  GetPortfolioResponse,
  GetPortfoliosResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '@zachweinberg/wealth-schema';
import axios from 'axios';
import firebase from '~/lib/firebase';

// const normalizeTimestamps = <T extends object>(value: T) =>
//   Object.keys(value).reduce((final, key) => {
//     const finalValue =
//       typeof admin.firestore.Timestamp === 'object' &&
//       value[key] instanceof admin.firestore.Timestamp
//         ? value[key].toDate()
//         : value[key] !== null && typeof value[key] === 'object' && !Array.isArray(value[key])
//         ? normalizeTimestamps(value[key])
//         : value[key];
//     return {
//       ...final,
//       [key]: finalValue,
//     };
//   }, {} as T);

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use((response) => {
  // response.data = normalizeTimestamps(response.data);
  return response;
});

const request = async <T, K>(
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
  createUser: (userData: CreateUserRequest) => {
    return request<CreateUserRequest, CreateUserResponse>(
      '/api/users',
      'post',
      userData,
      false
    );
  },
  verifyEmailExists: (email: string) => {
    return request<VerifyEmailRequest, VerifyEmailResponse>(
      '/api/users/verify',
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
  createPortfolio: (name: string, isPublic: boolean = false) => {
    return request<CreatePortfolioRequest, CreatePortfolioResponse>(
      '/api/portfolios',
      'post',
      { name, public: isPublic }
    );
  },
};
