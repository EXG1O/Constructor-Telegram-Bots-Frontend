import { Params } from 'react-router-dom';

import { DatabaseRecordsAPI } from 'services/api/telegram_bots/main';
import { APIResponse } from 'services/api/telegram_bots/types';

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
}): Promise<LoaderData> {
	const telegramBotID: number = parseInt(params.telegramBotID!);
	const [limit, offset] = [10, 0];

	const response = await DatabaseRecordsAPI.get(telegramBotID, limit, offset);

	if (!response.ok) {
		throw Error('Failed to fetch data.');
	}

	return { paginationData: { ...response.json, limit, offset, search: null } };
}

export default loader;
