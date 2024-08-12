import React, { ReactElement, useCallback, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import Stack from 'react-bootstrap/Stack';

import Block from 'components/Block';
import { createMessageToast } from 'components/ToastContainer';

import Toolbar from './components/Toolbar';
import VariableModal from './components/VariableModal';
import VariablesTable from './components/VariablesTable';
import VariablesContext from './contexts/VariablesContext';

import { VariablesAPI } from 'services/api/telegram_bots/main';

import {
	LoaderData as TelegramBotMenuVariablesLoaderData,
	PaginationData,
} from '../..';

function UserVariables(): ReactElement {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;
	const { paginationData: initialPaginationData } = useRouteLoaderData(
		'telegram-bot-menu-variables',
	) as TelegramBotMenuVariablesLoaderData;

	const [paginationData, setPaginationData] =
		useState<PaginationData>(initialPaginationData);
	const [loading, setLoading] = useState<boolean>(false);

	const updateVariables = useCallback(
		async (
			limit: number = paginationData.limit,
			offset: number = paginationData.offset,
			search: string = paginationData.search,
		): Promise<void> => {
			setLoading(true);

			const response = await VariablesAPI.get(
				telegramBot.id,
				limit,
				offset,
				search,
			);

			if (response.ok) {
				setPaginationData({ ...response.json, limit, offset, search });
			} else {
				createMessageToast({
					message: gettext('Не удалось получить список переменных!'),
					level: 'error',
				});
			}

			setLoading(false);
		},
		[telegramBot, paginationData],
	);

	const handleAddOrSaveVariable = useCallback(
		() => updateVariables(),
		[updateVariables],
	);

	return (
		<VariableModal.StoreProvider
			onAdd={handleAddOrSaveVariable}
			onSave={handleAddOrSaveVariable}
		>
			<VariableModal />
			<Block variant='light'>
				<h3 className='fw-semibold text-center mb-3'>
					{gettext('Пользовательские переменные')}
				</h3>
				<Stack gap={2}>
					<VariablesContext.Provider
						value={{
							variables: paginationData.results,
							filter: { search: paginationData.search },
							updateVariables,
						}}
					>
						<Toolbar paginationData={paginationData} />
						<VariablesTable loading={loading} />
					</VariablesContext.Provider>
				</Stack>
			</Block>
		</VariableModal.StoreProvider>
	);
}

export default UserVariables;
