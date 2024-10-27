import { UpdatesAPI } from 'services/api/updates/main';
import { APIResponse } from 'services/api/updates/types';

export interface PaginationData extends APIResponse.UpdatesAPI.Get.Pagination {
	limit: number;
	offset: number;
}

export interface LoaderData {
	paginationData: PaginationData;
}

async function loader(): Promise<LoaderData> {
	const [limit, offset] = [3, 0];

	const response = await UpdatesAPI.get(limit, offset);

	if (!response.ok) {
		throw Error('Failed to fetch data.');
	}

	return { paginationData: { ...response.json, limit, offset } };
}

export default loader;
