import { makeRequest } from 'services/api/base';
import { APIResponse } from './types';

const rootUrl = '/api/instruction/';

export namespace SectionsAPI {
	const url = rootUrl + 'sections/';

	export const get = () => makeRequest<APIResponse.SectionsAPI.Get>(url, 'GET');
}