import { TELEGRAM_LOGIN_REDIRECT_URI } from 'components/shared/LoginButton';

import { JWTStorage } from 'api/storage';
import { UsersAPI } from 'api/users';

export interface LoaderData {
  success: boolean;
}

async function loader(): Promise<LoaderData> {
  const code: string | null = new URLSearchParams(location.search).get('code');

  if (!code) {
    return { success: false };
  }

  const response = await UsersAPI.login({
    code,
    redirect_uri: TELEGRAM_LOGIN_REDIRECT_URI,
  });

  if (response.ok) {
    const { refresh_token, access_token } = response.json;

    JWTStorage.setRefreshToken(refresh_token);
    JWTStorage.setAccessToken(access_token);
  }

  return { success: response.status === 200 };
}

export default loader;
