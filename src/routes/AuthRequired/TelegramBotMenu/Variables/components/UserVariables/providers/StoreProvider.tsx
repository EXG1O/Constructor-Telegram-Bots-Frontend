import React, { memo, ReactElement, ReactNode, useEffect, useMemo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import StoreContext from '../contexts/StoreContext';

import { LoaderData as TelegramBotMenuVariablesLoaderData } from '../../..';
import { createStore, InitialProps } from '../store';

export interface StoreProviderProps {
	children: ReactNode;
}

function StoreProvider({
	children,
}: StoreProviderProps): ReactElement<StoreProviderProps> {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;
	const { paginationData: initialPaginationData } = useRouteLoaderData(
		'telegram-bot-menu-variables',
	) as TelegramBotMenuVariablesLoaderData;

	const paginationData = useMemo<Omit<InitialProps, 'telegramBot'>>(
		() => ({
			count: initialPaginationData.count,
			limit: initialPaginationData.limit,
			offset: initialPaginationData.offset,
			variables: initialPaginationData.results,
		}),
		[initialPaginationData],
	);

	const store = useMemo(() => createStore({ telegramBot, ...paginationData }), []);

	useEffect(() => store.setState(paginationData), [paginationData]);

	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default memo(StoreProvider);
