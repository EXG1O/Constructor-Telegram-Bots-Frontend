import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Loading from 'components/Loading';
import Page from 'components/Page';
import Pagination from 'components/Pagination';
import { createMessageToast } from 'components/ToastContainer';

import UpdateDisplay from './components/UpdateDisplay';

import useUpdatesRouteLoaderData from './hooks/useUpdatesRouteLoaderData';

import { UpdatesAPI } from 'services/api/updates/main';

import { PaginationData } from './loader';

function Updates(): ReactElement {
	const { t, i18n } = useTranslation(RouteID.Updates);

	const { paginationData: initialPaginationData } = useUpdatesRouteLoaderData();

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
