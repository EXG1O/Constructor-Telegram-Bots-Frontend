import { Params } from 'react-router-dom';

import { UsersAPI } from 'services/api/telegram_bots/main';
import { APIResponse } from 'services/api/telegram_bots/types';

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
}): Promise<LoaderData | Response> {
	const telegramBotID: number = parseInt(params.telegramBotID!);
	const [limit, offset] = [20, 0];

	const response = await UsersAPI.get(telegramBotID, limit, offset);

	if (!response.ok) {
		throw Error('Failed to fetch data.');
	}

	return {
		paginationData: { ...response.json, limit, offset, search: '', type: 'all' },
	};
}

export default loader;
