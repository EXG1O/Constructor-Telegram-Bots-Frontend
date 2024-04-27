import React, { ReactElement, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import Card from 'react-bootstrap/Card';

import Toolbar from './components/Toolbar';
import VariableList from './components/VariableList';

import VariablesContext from './contexts/VariablesContext';

import useToast from 'services/hooks/useToast';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';
import { LoaderData as TelegramBotMenuVariablesLoaderData, PaginationData } from '../..';

import { VariablesAPI } from 'services/api/telegram_bots/main';

function UserVariables(): ReactElement {
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;
	const { paginationData: initialPaginationData } = useRouteLoaderData('telegram-bot-menu-variables') as TelegramBotMenuVariablesLoaderData;

	const { createMessageToast } = useToast();

	const [paginationData, setPaginationData] = useState<PaginationData>(initialPaginationData);
	const [loading, setLoading] = useState<boolean>(false);

	async function updateVariables(
		limit: number = paginationData.limit,
		offset: number = paginationData.offset,
		search: string = paginationData.search,
	): Promise<void> {
		setLoading(true);

		const response = await VariablesAPI.get(telegramBot.id, limit, offset, search);

		if (response.ok) {
			setPaginationData({ ...response.json, limit, offset, search });
		} else {
			createMessageToast({
				message: gettext('Не удалось получить список переменных!'),
				level: 'error',
			});
		}

		setLoading(false);
	}

	return (
		<Card>
			<Card.Header as='h5' className='text-center'>
				{gettext('Пользовательские переменные')}
			</Card.Header>
			<Card.Body className='vstack gap-2'>
				<VariablesContext.Provider value={{
					variables: paginationData.results,
					filter: { search: paginationData.search },
					updateVariables,
				}}>
					<Toolbar paginationData={paginationData} />
					<VariableList loading={loading} />
				</VariablesContext.Provider>
			</Card.Body>
		</Card>
	);
}

export default UserVariables;