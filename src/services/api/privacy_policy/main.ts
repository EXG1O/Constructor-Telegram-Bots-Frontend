import { makeRequest } from 'services/api/core';

import { APIResponse } from './types';

const rootUrl: string = '/api/privacy-policy/';

export namespace SectionsAPI {
	const url: string = rootUrl + 'sections/';

	export async function get() {
		return await makeRequest<APIResponse.SectionsAPI.Get>(url, 'GET');
	}
}
