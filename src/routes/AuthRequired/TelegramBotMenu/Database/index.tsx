import React, { ReactElement } from 'react';
import { Params } from 'react-router-dom';

import Stack from 'react-bootstrap/Stack';

import Block from 'components/Block';
import Page from 'components/Page';

import RecordList from './components/RecordList';
import RecordModal from './components/RecordModal';
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
				<RecordModal.StoreProvider>
					<RecordModal />
					<Block variant='light'>
						<h3 className='fw-semibold text-center mb-3'>
							{gettext('Список записей')}
						</h3>
						<Stack gap={2}>
							<Toolbar />
							<RecordList />
						</Stack>
					</Block>
				</RecordModal.StoreProvider>
			</StoreProvider>
		</Page>
	);
}

export default Database;
