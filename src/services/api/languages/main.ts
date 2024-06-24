import { makeRequest } from 'services/api/base';

import { Data, APIResponse } from './types';

const rootURL: string = '/api/languages/';

export namespace LanguagesAPI {
	const url: string = rootURL;

	export async function get() {
		return await makeRequest<APIResponse.LanguagesAPI.Get>(url, 'GET');
	}

	export async function set(data: Data.LanguagesAPI.Set) {
		return await makeRequest(url, 'POST', data);
	}
}
