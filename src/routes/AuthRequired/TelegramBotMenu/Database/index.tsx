import React, { ReactElement } from 'react';
import { Params } from 'react-router-dom';

import Card from 'react-bootstrap/Card';

import Page from 'components/Page';

import RecordsTable from './components/RecordsTable';
import Toolbar from './components/Toolbar';
import StoreProvider from './providers/StoreProvider';

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

export async function loader({
	params,
}: {
	params: Params<'telegramBotID'>;
}): Promise<LoaderData> {
	const telegramBotID: number = parseInt(params.telegramBotID!);
	const [limit, offset] = [10, 0];

	const response = await DatabaseRecordsAPI.get(telegramBotID, limit, offset);

	if (!response.ok) {
		throw Error('Failed to fetch data!');
	}

	return { paginationData: { ...response.json, limit, offset, search: null } };
}

function Database(): ReactElement {
	return (
		<Page title={gettext('База данных')} grid>
			<StoreProvider>
				<Card>
					<Card.Header as='h5' className='text-center'>
						{gettext('Список записей')}
					</Card.Header>
					<Card.Body className='vstack gap-2'>
						<Toolbar />
						<RecordsTable />
					</Card.Body>
				</Card>
			</StoreProvider>
		</Page>
	);
}

export default Database;
