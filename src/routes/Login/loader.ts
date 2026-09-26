import { LocalStorageKey } from 'enums/storage';

import { UsersService } from 'api';

export interface LoaderData {
  success: boolean;
}

async function loader(): Promise<LoaderData> {
  const code: string | null = new URLSearchParams(window.location.search).get('code');
  const redirectURI: string | null = window.localStorage.getItem(
    LocalStorageKey.TelegramLoginRedirectURI,
  );

  if (!code || !redirectURI) {
    return { success: false };
  }

  const { data } = await UsersService.postUserLogin({
    body: { code, redirect_uri: redirectURI },
  });

  if (data) {
    window.localStorage.setItem(LocalStorageKey.RefreshToken, data.refresh_token);
    window.localStorage.setItem(LocalStorageKey.AccessToken, data.access_token);
  }

  return { success: Boolean(data) };
}

export default loader;
