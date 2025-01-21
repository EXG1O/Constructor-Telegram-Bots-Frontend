import { MethodsAPI, SectionsAPI } from 'api/donations/main';
import { APIResponse } from 'api/donations/types';

export interface LoaderData {
  sections: APIResponse.SectionsAPI.Get;
  methods: APIResponse.MethodsAPI.Get;
}

async function loader(): Promise<LoaderData> {
  const [sectionsResponse, methodsResponse] = await Promise.all([
    SectionsAPI.get(),
    MethodsAPI.get(),
  ]);

  if (!sectionsResponse.ok || !methodsResponse.ok) {
    throw Error('Failed to fetch data.');
  }

  return {
    sections: sectionsResponse.json,
    methods: methodsResponse.json,
  };
}

export default loader;
