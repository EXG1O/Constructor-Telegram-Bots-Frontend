import React, { memo, ReactElement, ReactNode, useCallback, useMemo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import StoreContext from '../contexts/StoreContext';

import useDatabaseRecordsStore from '../../../hooks/useDatabaseRecordsStore';

import { createStore } from '../store';

export interface StoreProviderProps {
	children: ReactNode;
}

function StoreProvider({
	children,
}: StoreProviderProps): ReactElement<StoreProviderProps> {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;

	const updateRecords = useDatabaseRecordsStore((state) => state.updateRecords);

	const handleAdd = useCallback(() => updateRecords(), []);

	const store = useMemo(() => createStore({ telegramBot, onAdd: handleAdd }), []);

	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default memo(StoreProvider);
