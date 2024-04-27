import { makeRequest } from 'services/api/base';
import { Data, APIResponse } from './types';

const rootURL = '/api/languages/';

export namespace LanguagesAPI {
	export const get = () => makeRequest<APIResponse.LanguagesAPI.Get>(rootURL, 'GET');
	export const set = (data: Data.LanguagesAPI.Set) => (
		makeRequest<APIResponse.LanguagesAPI.Set>(rootURL, 'POST', data)
	);
}