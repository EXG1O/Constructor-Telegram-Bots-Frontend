import { LanguagesAPI } from 'api/languages/main';
import { APIResponse } from 'api/languages/types';

export interface LoaderData {
  languages: APIResponse.LanguagesAPI.Get;
}

async function loader(): Promise<LoaderData> {
  const response = await LanguagesAPI.get();

  if (!response.ok) {
    throw Error('Failed to fetch data.');
  }

  return { languages: response.json };
}

export default loader;
