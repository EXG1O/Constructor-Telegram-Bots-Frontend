import React, { memo, ReactElement, ReactNode, useEffect, useMemo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import useTelegramBotMenuRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRouteLoaderData';

import StoreContext from '../contexts/StoreContext';

import { LoaderData as TelegramBotMenuVariablesLoaderData } from '../../..';
import { createStore, InitialProps } from '../store';

export interface StoreProviderProps {
	children: ReactNode;
}

function StoreProvider({
	children,
}: StoreProviderProps): ReactElement<StoreProviderProps> {
	const { telegramBot } = useTelegramBotMenuRouteLoaderData();
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
