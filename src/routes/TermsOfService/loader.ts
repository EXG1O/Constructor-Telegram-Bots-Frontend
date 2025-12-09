import { SectionsAPI } from 'api/terms-of-service';
import { APIResponse } from 'api/terms-of-service/types';

export interface LoaderData {
  sections: APIResponse.SectionsAPI.Get;
}

async function loader(): Promise<LoaderData> {
  const response = await SectionsAPI.get();

  if (!response.ok) {
    throw Error('Failed to fetch data.');
  }

  return { sections: response.json };
}

export default loader;
