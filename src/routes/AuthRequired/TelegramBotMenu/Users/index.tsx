import React, { ReactElement } from 'react';
import { Params } from 'react-router-dom';

import Card from 'react-bootstrap/Card';

import Page from 'components/Page';

import Toolbar from './components/Toolbar';
import UsersTable from './components/UsersTable';
import StoreProvider from './providers/StoreProvider';

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

export async function loader({
	params,
}: {
	params: Params<'telegramBotID'>;
}): Promise<LoaderData | Response> {
	const telegramBotID: number = parseInt(params.telegramBotID!);
	const [limit, offset] = [20, 0];

	const response = await UsersAPI.get(telegramBotID, limit, offset);

	if (!response.ok) {
		throw Error('Failed to fetch data!');
	}

	return {
		paginationData: { ...response.json, limit, offset, search: '', type: 'all' },
	};
}

function Users(): ReactElement {
	return (
		<Page title={gettext('Пользователи')} grid>
			<StoreProvider>
				<Card>
					<Card.Header as='h5' className='text-center'>
						{gettext('Список пользователей')}
					</Card.Header>
					<Card.Body className='vstack gap-2'>
						<Toolbar />
						<UsersTable />
					</Card.Body>
				</Card>
			</StoreProvider>
		</Page>
	);
}

export default Users;
