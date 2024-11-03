import React, { memo, ReactElement, ReactNode, useCallback, useMemo } from 'react';

import useTelegramBotMenuRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRouteLoaderData';

import StoreContext from '../contexts/StoreContext';

import useDatabaseRecordsStore from '../../../hooks/useDatabaseRecordsStore';

import { createStore } from '../store';

export interface StoreProviderProps {
	children: ReactNode;
}

function StoreProvider({
	children,
}: StoreProviderProps): ReactElement<StoreProviderProps> {
	const { telegramBot } = useTelegramBotMenuRouteLoaderData();

	const updateRecords = useDatabaseRecordsStore((state) => state.updateRecords);

	const handleAdd = useCallback(() => updateRecords(), []);

	const store = useMemo(() => createStore({ telegramBot, onAdd: handleAdd }), []);

	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default memo(StoreProvider);
