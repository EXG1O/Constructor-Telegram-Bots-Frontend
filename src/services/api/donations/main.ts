import { makeRequest } from 'services/api/core';

import { APIResponse } from './types';

const rootURL: string = '/api/donation/';

export namespace DonationsAPI {
	export const url: string = rootURL + 'donations/';

	export async function get<Limit extends number | undefined>(
		limit?: Limit,
		offset?: number,
	) {
		let url: string = DonationsAPI.url;

		if (limit || offset) {
			const params = new URLSearchParams();
			limit && params.set('limit', limit.toString());
			offset && params.set('offset', offset.toString());

			url += `?${params.toString()}`;
		}

		return await makeRequest<
			Limit extends number
				? APIResponse.DonationsAPI.Get.Pagination
				: APIResponse.DonationsAPI.Get.Default
		>(url, 'GET');
	}
}

export namespace SectionsAPI {
	export const url: string = rootURL + 'sections/';

	export async function get() {
		return await makeRequest<APIResponse.SectionsAPI.Get>(url, 'GET');
	}
}

export namespace ButtonsAPI {
	export const url: string = rootURL + 'buttons/';

	export async function get() {
		return await makeRequest<APIResponse.ButtonsAPI.Get>(url, 'GET');
	}
}
