import type { Headers } from './components/HeadersBlock/types';

import type { ApiRequestMethod } from 'api';

export function getBodyBlockOpen(method: ApiRequestMethod): boolean {
  return ['post', 'put', 'patch'].includes(method);
}

export function convertHeadersToRecord(headers: Headers) {
  return headers.reduce<Record<string, string>>((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});
}
