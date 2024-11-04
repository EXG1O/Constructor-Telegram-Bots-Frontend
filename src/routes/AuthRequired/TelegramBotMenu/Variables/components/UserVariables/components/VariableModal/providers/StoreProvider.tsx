import React, { memo, ReactElement, ReactNode, useEffect, useMemo } from 'react';

import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

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
	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

	const store = useMemo(() => createStore({ telegramBot, onAdd, onSave }), []);

	useEffect(() => store.setState({ onAdd, onSave }), [onAdd, onSave]);

	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default memo(StoreProvider);
