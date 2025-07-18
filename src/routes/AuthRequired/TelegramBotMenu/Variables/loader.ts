import { Params } from 'react-router-dom';

import { VariablesAPI } from 'api/telegram_bots/variable';
import { APIResponse } from 'api/telegram_bots/variable/types';

export interface PaginationData extends APIResponse.VariablesAPI.Get.Pagination {
  limit: number;
  offset: number;
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

  const response = await VariablesAPI.get(telegramBotID, limit, offset);

  if (!response.ok) return null;

  return { paginationData: { ...response.json, limit, offset } };
}

export default loader;
