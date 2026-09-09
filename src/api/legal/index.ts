import { makeRequest } from 'api/core';

import type { DocumentType } from './enums';
import type { APIResponse } from './types';

const ROOT_URL: string = '/api/legal/';

interface Options {
  type: DocumentType;
}

export class DocumentAPI {
  static getURL({ type }: Options): string {
    return ROOT_URL + `documents/${type}/`;
  }

  static async get(options: Options) {
    return makeRequest<APIResponse.DocumentAPI.Get>(this.getURL(options), 'GET');
  }
}
