import { makeRequest } from 'services/api/base';
import { APIResponse } from './types';

const rootUrl: string = '/api/instruction/';

export namespace SectionsAPI {
	const url: string = rootUrl + 'sections/';

	export async function get() {
		return await makeRequest<APIResponse.SectionsAPI.Get>(url, 'GET');
	}
}
