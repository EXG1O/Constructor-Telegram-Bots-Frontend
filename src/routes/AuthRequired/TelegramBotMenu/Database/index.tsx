import React, { ReactElement, useState } from 'react';
import { Params, useRouteLoaderData } from 'react-router-dom';

import Card from 'react-bootstrap/Card';

import Title from 'components/Title';

import Toolbar from './components/Toolbar';
import RecordList from './components/RecordList';

import useToast from 'services/hooks/useToast';

import RecordsContext from './contexts/RecordsContext';

import { LoaderData as TelegramBotMenuRootLoaderData } from '../Root';

import { DatabaseRecordsAPI } from 'services/api/telegram_bots/main';
import { APIResponse } from 'services/api/telegram_bots/types';

export interface PaginationData extends APIResponse.DatabaseRecordsAPI.Get.Pagination {
	limit: number;
	offset: number;
	search: string;
}

export interface LoaderData {
	paginationData: PaginationData;
}

export async function loader({ params }: { params: Params<'telegramBotID'> }): Promise<LoaderData> {
	const telegramBotID: number = parseInt(params.telegramBotID!);
	const [limit, offset] = [10, 0];

	const response = await DatabaseRecordsAPI.get(telegramBotID, limit, offset);

	if (!response.ok) {
		throw Error('Failed to fetch data!');
	}

	return { paginationData: { ...response.json, limit, offset, search: '' } };
}

function Database(): ReactElement {
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;
	const { paginationData: initialPaginationData } = useRouteLoaderData('telegram-bot-menu-database') as LoaderData;

	const { createMessageToast } = useToast();

	const [paginationData, setPaginationData] = useState<PaginationData>(initialPaginationData);
	const [loading, setLoading] = useState<boolean>(false);

	async function updateRecords(
		limit: number = paginationData.limit,
		offset: number = paginationData.offset,
		search: string = paginationData.search,
	): Promise<void> {
		setLoading(true);

		const response = await DatabaseRecordsAPI.get(telegramBot.id, limit, offset, search);

		if (response.ok) {
			setPaginationData({ ...response.json, limit, offset, search });
		} else {
			createMessageToast({
				message: gettext('Не удалось получить список записей!'),
				level: 'error',
			});
		}

		setLoading(false);
	}

	return (
		<Title title={gettext('База данных')}>
			<Card>
				<Card.Header as='h5' className='text-center'>
					{gettext('Список записей')}
				</Card.Header>
				<Card.Body className='vstack gap-2'>
					<RecordsContext.Provider value={{
						records: paginationData.results,
						filter: { search: paginationData.search },
						updateRecords,
					}}>
						<Toolbar paginationData={paginationData} />
						<RecordList loading={loading} />
					</RecordsContext.Provider>
				</Card.Body>
			</Card>
		</Title>
	);
}

export default Database;