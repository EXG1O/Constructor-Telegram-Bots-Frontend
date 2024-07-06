import { makeRequest } from 'services/api/base';

import { APIResponse, Data } from './types';

const rootURL: string = '/api/users/';

export namespace StatsAPI {
	export const url = rootURL + 'stats/';

	export async function get() {
		return await makeRequest<APIResponse.StatsAPI.Get>(url, 'GET');
	}
}

export namespace UserAPI {
	export const url = rootURL + '_/';

	export async function get() {
		return await makeRequest<APIResponse.UserAPI.Get>(url, 'GET');
	}

	export async function login(data: Data.UserAPI.Login) {
		return await makeRequest(url + 'login/', 'POST', data);
	}

	export async function logout() {
		return await makeRequest(url + 'logout/', 'POST');
	}
}
