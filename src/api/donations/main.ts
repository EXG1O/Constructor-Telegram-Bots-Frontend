import { makeRequest } from 'api/core';

import { APIResponse } from './types';

const rootURL: string = '/api/donation/';

export class DonationsAPI {
	static url: string = rootURL + 'donations/';

	static async get<Limit extends number | undefined>(limit?: Limit, offset?: number) {
		let url: string = this.url;

		if (limit || offset) {
			const params = new URLSearchParams();
			limit && params.set('limit', limit.toString());
			offset && params.set('offset', offset.toString());

			url += `?${params.toString()}`;
		}

		return makeRequest<
			Limit extends number
				? APIResponse.DonationsAPI.Get.Pagination
				: APIResponse.DonationsAPI.Get.Default
		>(url, 'GET');
	}
}

export class SectionsAPI {
	static url: string = rootURL + 'sections/';

	static async get() {
		return makeRequest<APIResponse.SectionsAPI.Get>(this.url, 'GET');
	}
}

export class MethodsAPI {
	static url: string = rootURL + 'methods/';

	static async get() {
		return makeRequest<APIResponse.MethodsAPI.Get>(this.url, 'GET');
	}
}
