import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/env';
import { clearTokens, getAccessToken, getRefreshToken, saveTokens, TokenPair } from './tokenStorage';

const REQUEST_TIMEOUT_MS = 15000;

// These endpoints answer 401 for reasons unrelated to an expired session (e.g. wrong password),
// so a 401 from them must never trigger a token refresh.
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

// Separate instance without interceptors so a failing refresh can never recurse into itself.
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(handler: () => void) {
  onUnauthorized = handler;
}

// Refresh tokens are single-use, so concurrent 401s must share one refresh request.
let refreshInFlight: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');
      const { data } = await refreshClient.post<TokenPair>('/auth/refresh', { refreshToken });
      await saveTokens(data);
      return data.token;
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

function isAuthEndpoint(url?: string) {
  return !!url && AUTH_ENDPOINTS.some((path) => url.includes(path));
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;

    if (error.response?.status !== 401 || !config || config._retried || isAuthEndpoint(config.url)) {
      return Promise.reject(error);
    }

    config._retried = true;
    try {
      const token = await refreshAccessToken();
      config.headers.Authorization = `Bearer ${token}`;
      return apiClient(config);
    } catch (refreshError) {
      // Only a rejected refresh token ends the session; a network blip must not log the user out.
      if (axios.isAxiosError(refreshError) && !refreshError.response) {
        return Promise.reject(error);
      }
      await clearTokens();
      onUnauthorized?.();
      return Promise.reject(error);
    }
  }
);

export default apiClient;
