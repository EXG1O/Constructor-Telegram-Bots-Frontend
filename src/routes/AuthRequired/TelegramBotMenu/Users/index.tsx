import React, { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Params } from 'react-router-dom';
import { Stack } from 'react-bootstrap';

import Block from 'components/Block';
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
		throw Error('Failed to fetch data.');
	}

	return {
		paginationData: { ...response.json, limit, offset, search: '', type: 'all' },
	};
}

function Users(): ReactElement {
	const { t, i18n } = useTranslation('telegram-bot-menu-users');

	const title = useMemo<string>(() => t('title'), [i18n.language]);

	return (
		<Page title={title} grid>
			<StoreProvider>
				<Block variant='light'>
					<h3 className='fw-semibold text-center mb-3'>{title}</h3>
					<Stack gap={2}>
						<Toolbar />
						<UsersTable />
					</Stack>
				</Block>
			</StoreProvider>
		</Page>
	);
}

export default Users;
