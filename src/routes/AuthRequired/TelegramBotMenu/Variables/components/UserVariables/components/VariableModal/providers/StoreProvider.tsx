import React, { memo, ReactElement, ReactNode, useEffect, useMemo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import StoreContext from '../contexts/StoreContext';

import { createStore, InitialProps } from '../store';

export interface StoreProviderProps extends Pick<InitialProps, 'onAdd' | 'onSave'> {
	children: ReactNode;
}

function StoreProvider({
	children,
	onAdd,
	onSave,
}: StoreProviderProps): ReactElement<StoreProviderProps> {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;

	const store = useMemo(() => createStore({ telegramBot, onAdd, onSave }), []);

	useEffect(() => store.setState({ onAdd, onSave }), [onAdd, onSave]);

	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default memo(StoreProvider);
