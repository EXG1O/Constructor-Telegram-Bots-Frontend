import { makeRequest } from 'services/api/base';
import { APIResponse } from './types';

const rootURL = '/api/donations/';

export namespace DonationsAPI {
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
			APIResponse.DonationsAPI.Get.Pagination :
			APIResponse.DonationsAPI.Get.Default
		>(url, 'GET');
	}
}

export namespace SectionsAPI {
	export const url = rootURL + 'sections/';

	export const get = () => makeRequest<APIResponse.SectionsAPI.Get>(url, 'GET');
}

export namespace ButtonsAPI {
	export const url = rootURL + 'buttons/';

	export const get = () => makeRequest<APIResponse.ButtonsAPI.Get>(url, 'GET');
}
