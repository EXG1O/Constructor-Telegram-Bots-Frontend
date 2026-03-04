import type { Params } from 'react-router-dom';

import { UsersAPI } from 'api/telegram-bots/user';
import type { APIResponse } from 'api/telegram-bots/user/types';

export type Type = 'all' | 'allowed' | 'blocked';

export interface PaginationData extends APIResponse.UsersAPI.Get.Pagination {
  limit: number;
  offset: number;
  search: string | null;
  type: Type;
}

export interface LoaderData {
  pagination: PaginationData;
}

async function loader({
  params,
}: {
  params: Params<'telegramBotID'>;
}): Promise<LoaderData | null> {
  const telegramBotID = Number(params.telegramBotID);
  if (Number.isNaN(telegramBotID)) return null;

  const [limit, offset] = [20, 0];

  const response = await UsersAPI.get(telegramBotID, limit, offset);
  if (!response.ok) return null;

  return { pagination: { ...response.json, limit, offset, search: null, type: 'all' } };
}

export default loader;
