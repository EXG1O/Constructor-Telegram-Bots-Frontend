import { makeRequest } from 'services/api/core';

import { APIResponse, Data } from './types';

const rootURL: string = '/api/users/';

export namespace StatsAPI {
	export const url = rootURL + 'stats/';

	export async function get() {
		return await makeRequest<APIResponse.StatsAPI.Get>(url, 'GET');
	}
}

export namespace UsersAPI {
	export const url = rootURL;

	export async function login(data: Data.UsersAPI.Login) {
		return await makeRequest(url + 'login/', 'POST', data);
	}
}

export namespace UserAPI {
	export const url = rootURL + 'me/';

	export async function get() {
		return await makeRequest<APIResponse.UserAPI.Get>(url, 'GET', undefined, true);
	}

	export async function logout() {
		return await makeRequest(url + 'logout/', 'POST', undefined, true);
	}

	export async function logoutAll() {
		return await makeRequest(url + 'logout-all/', 'POST', undefined, true);
	}

	export async function tokenRefresh() {
		return await makeRequest(url + 'token-refresh/', 'POST', undefined);
	}

	export async function _delete() {
		return await makeRequest(url, 'DELETE', undefined, true);
	}
}
