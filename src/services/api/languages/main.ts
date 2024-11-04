import { makeRequest } from 'services/api/core';

import { APIResponse, Data } from './types';

const rootURL: string = '/api/languages/';

export class LanguagesAPI {
	static url: string = rootURL;

	static async get() {
		return makeRequest<APIResponse.LanguagesAPI.Get>(this.url, 'GET');
	}
	static async set(data: Data.LanguagesAPI.Set) {
		return makeRequest(this.url, 'POST', data);
	}
}
