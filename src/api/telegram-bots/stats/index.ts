import { ROOT_URL } from '..';

import { makeRequest } from 'api/core';

import { APIResponse } from './types';

export class StatsAPI {
  static url: string = ROOT_URL + 'stats/';

  static async get() {
    return makeRequest<APIResponse.StatsAPI.Get>(this.url, 'GET');
  }
}
