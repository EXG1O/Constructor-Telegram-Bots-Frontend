import { TokensAPI } from 'api/users';
import type { APIResponse } from 'api/users/types';

export interface LoaderData {
  refreshTokens: APIResponse.TokensAPI.Get;
}

async function loader(): Promise<LoaderData | null> {
  const response = await TokensAPI.get('refresh');
  return response.ok ? { refreshTokens: response.json } : null;
}

export default loader;
