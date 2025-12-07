import { JWTStorage } from './storage';
import { UserAPI } from './users';

export namespace APIResponse {
  export interface Base<Ok extends boolean, Json extends Record<string, any>>
    extends Omit<Response, 'ok' | 'json'> {
    ok: Ok;
    json: Json;
  }

  export interface ErrorDetail {
    code: string;
    detail: string;
    attr: string | null;
  }

  export interface ErrorList {
    type: 'server_error' | 'client_error' | 'validation_error';
    errors: ErrorDetail[];
  }
}

let isRefreshing = false;
let waitingResolvers: ((accessToken: string | null) => void)[] = [];

async function accessTokenRefresh(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => waitingResolvers.push(resolve));
  }

  isRefreshing = true;

  let accessToken: string | null = null;

  const refreshToken: string | null = JWTStorage.getRefreshToken();

  if (refreshToken) {
    const response = await UserAPI.tokenRefresh({ refresh_token: refreshToken });

    if (response.ok) {
      accessToken = response.json.access_token;
      JWTStorage.setAccessToken(accessToken);
    }
  }

  if (!accessToken) {
    JWTStorage.clearTokens();
  }

  waitingResolvers.forEach((resolve) => resolve(accessToken));
  waitingResolvers = [];

  isRefreshing = false;

  return accessToken;
}

async function authFetch(url: string, init: RequestInit): Promise<Response> {
  const response = await fetch(url, init);

  if (response.status !== 401) {
    return response;
  }

  const accessToken: string | null = await accessTokenRefresh();

  if (!accessToken) {
    return response;
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Token ${accessToken}`);

  return await fetch(url, { ...init, headers });
}

export async function makeRequest<
  SuccessAPIResponse extends Record<string, any> = Record<string, never>,
  ErrorAPIResponse extends Record<string, any> = APIResponse.ErrorList,
>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  data?: Record<string, any> | FormData,
  authRequired: boolean = false,
): Promise<
  APIResponse.Base<true, SuccessAPIResponse> | APIResponse.Base<false, ErrorAPIResponse>
> {
  const init: RequestInit = { method };
  const headers = new Headers();

  if (data !== undefined) {
    if (data instanceof FormData) {
      init.body = data;
    } else {
      headers.set('Content-Type', 'application/json');
      init.body = JSON.stringify(data);
    }
  }

  if (authRequired) {
    const accessToken: string | null = JWTStorage.getAccessToken();

    if (accessToken) {
      headers.set('Authorization', `Token ${accessToken}`);
    }
  }

  init.headers = headers;

  const response: Response = authRequired
    ? await authFetch(url, init)
    : await fetch(url, init);
  const json: any = await response.json().catch(() => ({}));

  return Object.assign(response, { json });
}
