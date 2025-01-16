import { makeRequest } from 'api/core';

import { APIResponse } from './types';

const rootURL: string = '/api/updates/';

export class UpdatesAPI {
	static url: string = rootURL;

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
				? APIResponse.UpdatesAPI.Get.Pagination
				: APIResponse.UpdatesAPI.Get.Default
		>(url, 'GET');
	}
}
