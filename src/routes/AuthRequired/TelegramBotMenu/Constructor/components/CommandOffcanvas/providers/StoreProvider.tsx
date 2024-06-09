import React, { ReactElement, ReactNode, useMemo, useEffect } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { createStore, InitialProps } from '../store';

import useToast from 'services/hooks/useToast';

import StoreContext from '../contexts/StoreContext';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

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

	const { createMessageToast } = useToast();

	const store = useMemo(
		() => createStore({ telegramBot, createMessageToast, onAdd, onSave }),
		[],
	);

	useEffect(() => store.setState({ onAdd, onSave }), [onAdd, onSave]);

	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default StoreProvider;
