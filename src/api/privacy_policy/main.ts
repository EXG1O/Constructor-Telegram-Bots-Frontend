import { makeRequest } from 'api/core';

import { APIResponse } from './types';

const rootUrl: string = '/api/privacy-policy/';

export class SectionsAPI {
	static url: string = rootUrl + 'sections/';

	static async get() {
		return makeRequest<APIResponse.SectionsAPI.Get>(this.url, 'GET');
	}
}
