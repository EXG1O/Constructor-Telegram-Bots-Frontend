import { Params } from 'react-router-dom';

import { UsersAPI } from 'api/telegram-bots/user';
import { APIResponse } from 'api/telegram-bots/user/types';

export type Type = 'all' | 'allowed' | 'blocked';

export interface PaginationData extends APIResponse.UsersAPI.Get.Pagination {
  limit: number;
  offset: number;
  search: string | null;
  type: Type;
}

export interface LoaderData {
  paginationData: PaginationData;
}

async function loader({
  params,
}: {
  params: Params<'telegramBotID'>;
}): Promise<LoaderData | null> {
  const telegramBotID: number = parseInt(params.telegramBotID!);
  const [limit, offset] = [20, 0];

  const response = await UsersAPI.get(telegramBotID, limit, offset);

  if (!response.ok) return null;

  return {
    paginationData: { ...response.json, limit, offset, search: null, type: 'all' },
  };
}

export default loader;
