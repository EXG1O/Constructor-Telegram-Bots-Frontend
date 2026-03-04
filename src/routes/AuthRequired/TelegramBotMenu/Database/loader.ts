import type { Params } from 'react-router-dom';

import { DatabaseRecordsAPI } from 'api/telegram-bots/database-record';
import type { APIResponse } from 'api/telegram-bots/database-record/types';

export interface PaginationData extends APIResponse.DatabaseRecordsAPI.Get.Pagination {
  limit: number;
  offset: number;
  search: string | null;
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

  const [limit, offset] = [10, 0];

  const response = await DatabaseRecordsAPI.get(telegramBotID, limit, offset);
  if (!response.ok) return null;

  return { pagination: { ...response.json, limit, offset, search: null } };
}

export default loader;
