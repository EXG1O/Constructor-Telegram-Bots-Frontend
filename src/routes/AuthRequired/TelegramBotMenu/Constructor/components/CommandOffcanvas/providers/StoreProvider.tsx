import React, { ReactElement, ReactNode, useEffect, useMemo } from 'react';

import useTelegramBotMenuRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRouteLoaderData';

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
	const { telegramBot } = useTelegramBotMenuRouteLoaderData();

	const store = useMemo(() => createStore({ telegramBot, onAdd, onSave }), []);

	useEffect(() => store.setState({ onAdd, onSave }), [onAdd, onSave]);

	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default StoreProvider;
