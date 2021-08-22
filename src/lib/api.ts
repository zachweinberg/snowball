import {
  CreateUserRequest,
  CreateUserResponse,
  GetPortfoliosResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '@zachweinberg/wealth-schema';
import axios from 'axios';
import firebase from '~/lib/firebase';

const request = async <T, K>(
  path: string,
  method: 'put' | 'post' | 'get' | 'delete',
  body?: T,
  requireAuth: boolean = true
): Promise<K> => {
  try {
    let headers = {};

    if (requireAuth) {
      const token = await firebase.auth().currentUser?.getIdToken();

      if (!token) {
        console.error(`Error in: API request - token is ${token}`);
        console.error(`This error occured while trying to request [${method}] ${path}`);
        throw new Error('Unable to authenticate user for API request');
      }

      headers['Authorization'] = `Bearer ${token}`;
    }

    method = method || 'post';

    const url = `${process.env.NEXT_PUBLIC_API_BASE_PATH}${path}`;

    const response = await axios.request<K>({
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
};
