import { LocalStorageKey } from 'enums/storage';
import i18n from 'i18n';

import { UsersService } from './client';
import { client } from './client/client.gen';
import { getValidRequestBody } from './client/core/utils.gen';

let isRefreshing = false;
let waitingResolvers: ((accessToken: string | null) => void)[] = [];
let lastRefreshTime = 0;

async function refreshAccessToken(): Promise<string | null> {
  if (Date.now() - lastRefreshTime < 5000) {
    return window.localStorage.getItem(LocalStorageKey.AccessToken);
  }

  if (isRefreshing) {
    return new Promise((resolve) => waitingResolvers.push(resolve));
  }
  isRefreshing = true;

  const refreshToken: string | null = window.localStorage.getItem(
    LocalStorageKey.RefreshToken,
  );
  let accessToken: string | null = null;

  if (refreshToken) {
    const { data } = await UsersService.postUserTokenRefresh({
      body: { refresh_token: refreshToken },
    });

    if (data) {
      accessToken = data.access_token;
      window.localStorage.setItem(LocalStorageKey.AccessToken, accessToken);
      lastRefreshTime = Date.now();
    }
  }

  if (!accessToken) {
    window.localStorage.removeItem(LocalStorageKey.RefreshToken);
    window.localStorage.removeItem(LocalStorageKey.AccessToken);
  }

  isRefreshing = false;
  waitingResolvers.forEach((resolve) => resolve(accessToken));
  waitingResolvers = [];

  return accessToken;
}

client.setConfig({
  baseUrl: '',
  auth: async () => {
    let accessToken: string | null = window.localStorage.getItem(
      LocalStorageKey.AccessToken,
    );

    if (!accessToken) {
      accessToken = await refreshAccessToken();
    }

    return accessToken ? `Token ${accessToken}` : undefined;
  },
});
client.interceptors.request.use((request) => {
  request.headers.set('Accept-Language', i18n.language);
  return request;
});
client.interceptors.response.use(async (response, request, options) => {
  if (response.status !== 401 || !options.security) {
    return response;
  }

  const accessToken: string | null = await refreshAccessToken();

  if (!accessToken) {
    return response;
  }

  options.headers.set('Authorization', `Token ${accessToken}`);
  return options.fetch!.call(
    window,
    new Request(request.url, {
      redirect: 'follow',
      ...options,
      body: getValidRequestBody(options) as any,
    }),
  );
});

export * from './client';
export type { RequestResult } from './client/client';
export * from './enums';
export * from './types';
