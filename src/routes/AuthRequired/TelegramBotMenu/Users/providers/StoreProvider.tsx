import React, { memo, ReactElement, ReactNode, useEffect, useMemo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import { LoaderData as TelegramBotMenuUsersLoaderData } from '..';

import StoreContext from '../contexts/StoreContext';

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
		'telegram-bot-menu-users',
	) as TelegramBotMenuUsersLoaderData;

	const paginationData = useMemo<Omit<InitialProps, 'telegramBot'>>(() => {
		const { count, limit, offset, search, type, results } = initialPaginationData;
		return { count, limit, offset, search, type, users: results };
	}, [initialPaginationData]);

	const store = useMemo(() => createStore({ telegramBot, ...paginationData }), []);

	useEffect(() => store.setState(paginationData), [paginationData]);

	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default memo(StoreProvider);
