import { makeRequest } from 'services/api/core';

import { APIResponse } from './types';

const rootURL: string = '/api/updates/';

export namespace UpdatesAPI {
	export const url: string = rootURL;

	export async function get<Limit extends number | undefined>(
		limit?: Limit,
		offset?: number,
	) {
		let url: string = UpdatesAPI.url;

		if (limit || offset) {
			const params = new URLSearchParams();
			limit && params.set('limit', limit.toString());
			offset && params.set('offset', offset.toString());

			url += `?${params.toString()}`;
		}

		return await makeRequest<
			Limit extends number
				? APIResponse.UpdatesAPI.Get.Pagination
				: APIResponse.UpdatesAPI.Get.Default
		>(url, 'GET');
	}
}
