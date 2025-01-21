import { makeRequest } from 'api/core';

import { APIResponse, Data } from './types';

const rootURL: string = '/api/users/';

export class StatsAPI {
  static url: string = rootURL + 'stats/';

  static async get() {
    return makeRequest<APIResponse.StatsAPI.Get>(this.url, 'GET');
  }
}

export class UsersAPI {
  static url: string = rootURL;

  static async login(data: Data.UsersAPI.Login) {
    return makeRequest(this.url + 'login/', 'POST', data);
  }
}

export class UserAPI {
  static url: string = rootURL + 'me/';

  static async get() {
    return makeRequest<APIResponse.UserAPI.Get>(this.url, 'GET', undefined, true);
  }
  static async logout() {
    return makeRequest(this.url + 'logout/', 'POST', undefined, true);
  }
  static async logoutAll() {
    return makeRequest(this.url + 'logout-all/', 'POST', undefined, true);
  }
  static async tokenRefresh() {
    return makeRequest(this.url + 'token-refresh/', 'POST', undefined);
  }
  static async delete() {
    return makeRequest(this.url, 'DELETE', undefined, true);
  }
}
