import { Params } from 'react-router-dom';

import { VariablesAPI } from 'api/telegram-bots/variable';
import { APIResponse } from 'api/telegram-bots/variable/types';

export interface PaginationData extends APIResponse.VariablesAPI.Get.Pagination {
  limit: number;
  offset: number;
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

  const response = await VariablesAPI.get(telegramBotID, limit, offset);
  if (!response.ok) return null;

  return { pagination: { ...response.json, limit, offset } };
}

export default loader;
