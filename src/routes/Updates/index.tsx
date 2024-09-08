import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router-dom';

import Loading from 'components/Loading';
import Page from 'components/Page';
import Pagination from 'components/Pagination';
import { createMessageToast } from 'components/ToastContainer';

import UpdateDisplay from './components/UpdateDisplay';

import { UpdatesAPI } from 'services/api/updates/main';
import { APIResponse } from 'services/api/updates/types';

export interface PaginationData extends APIResponse.UpdatesAPI.Get.Pagination {
	limit: number;
	offset: number;
}

export interface LoaderData {
	paginationData: PaginationData;
}

export async function loader(): Promise<LoaderData> {
	const [limit, offset] = [3, 0];

	const response = await UpdatesAPI.get(limit, offset);

	if (!response.ok) {
		throw Error('Failed to fetch data.');
	}

	return { paginationData: { ...response.json, limit, offset } };
}

function Updates(): ReactElement {
	const { t, i18n } = useTranslation('updates');

	const { paginationData: initialPaginationData } = useRouteLoaderData(
		'updates',
	) as LoaderData;

	const [paginationData, setPaginationData] =
		useState<PaginationData>(initialPaginationData);
	const [loading, setLoading] = useState<boolean>(false);

	const title = useMemo<string>(() => t('title'), [i18n.language]);

	async function updateUpdates(
		limit: number = paginationData.limit,
		offset: number = paginationData.offset,
	): Promise<void> {
		setLoading(true);

		const response = await UpdatesAPI.get(limit, offset);

		if (response.ok) {
			setPaginationData({ ...response.json, limit, offset });
		} else {
			createMessageToast({
				message: t('messages.getUpdates.error'),
				level: 'error',
			});
		}

		setLoading(false);
	}

	return (
		<Page title={title} grid>
			<h1 className='fw-semibold text-center'>{title}</h1>
			{!loading ? (
				paginationData.results.map((update) => (
					<UpdateDisplay key={update.id} update={update} />
				))
			) : (
				<Loading size='lg' className='m-auto' />
			)}
			<Pagination
				itemCount={paginationData.count}
				itemLimit={paginationData.limit}
				itemOffset={paginationData.offset}
				className='align-self-center'
				onPageChange={useCallback(
					(newItemOffset) => updateUpdates(undefined, newItemOffset),
					[],
				)}
			/>
		</Page>
	);
}

export default Updates;
