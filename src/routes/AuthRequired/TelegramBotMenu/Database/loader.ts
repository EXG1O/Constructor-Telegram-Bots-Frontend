import { Params } from 'react-router-dom';

import { DatabaseRecordsAPI } from 'api/telegram_bots/database_record';
import { APIResponse } from 'api/telegram_bots/database_record/types';

export interface PaginationData extends APIResponse.DatabaseRecordsAPI.Get.Pagination {
  limit: number;
  offset: number;
  search: string | null;
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
  const [limit, offset] = [10, 0];

  const response = await DatabaseRecordsAPI.get(telegramBotID, limit, offset);

  if (!response.ok) return null;

  return { paginationData: { ...response.json, limit, offset, search: null } };
}

export default loader;
