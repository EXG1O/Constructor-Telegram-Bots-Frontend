import { Headers } from './components/HeadersBlock';

import { Method } from 'api/telegram_bots/api_request/types';

export function getBodyBlockOpen(method: Method): boolean {
  return ['post', 'put', 'patch'].includes(method);
}

export function convertHeadersToRecord(headers: Headers) {
  return headers.reduce<Record<string, string>>((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});
}
