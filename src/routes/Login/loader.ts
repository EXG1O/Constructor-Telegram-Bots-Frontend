import { JWTStorage } from 'api/storage';
import { UsersAPI } from 'api/users';
import { Data } from 'api/users/types';

export interface LoaderData {
  success: boolean;
}

type AuthData = Data.UsersAPI.Login;

function getAuthData(): AuthData | null {
  const authResultMatch: RegExpMatchArray | null = location.hash.match(
    /[#?&]tgAuthResult=([A-Za-z0-9\-_=]*)$/,
  );

  if (!authResultMatch) {
    return null;
  }

  let base64url: string = authResultMatch[1].replace(/-/g, '+').replace(/_/g, '/');

  const padding = base64url.length % 4;

  if (padding > 1) {
    base64url += new Array(5 - padding).join('=');
  }

  return JSON.parse(atob(base64url));
}

async function loader(): Promise<LoaderData> {
  const data: Data.UsersAPI.Login | null = getAuthData();

  if (!data) {
    return { success: false };
  }

  const response = await UsersAPI.login(data);

  if (response.ok) {
    const { refresh_token, access_token } = response.json;

    JWTStorage.setRefreshToken(refresh_token);
    JWTStorage.setAccessToken(access_token);
  }

  return { success: response.status === 200 };
}

export default loader;
