import { makeRequest } from 'services/api/base';
import { APIResponse } from './types';

const rootURL = '/api/updates/';

export namespace UpdatesAPI {
	export const get = <Limit extends number | undefined>(limit?: Limit, offset?: number) => {
		let url: string = rootURL;

		if (limit || offset) {
			const params = new URLSearchParams();
			limit && params.set('limit', limit.toString());
			offset && params.set('offset', offset.toString());

			url += `?${params.toString()}`;
		}

		return makeRequest<
			Limit extends number ?
			APIResponse.UpdatesAPI.Get.Pagination :
			APIResponse.UpdatesAPI.Get.Default
		>(url, 'GET');
	}
}