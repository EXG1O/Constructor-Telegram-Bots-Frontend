import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Page from 'components/Page';

import Header from './components/Header';
import TelegramBotList from './components/TelegramBotList';
import TelegramBotsContext from './contexts/TelegramBotsContext';

import useTelegramBotsRouteLoaderData from './hooks/useTelegramBotsRouteLoaderData';

import { TelegramBot } from 'services/api/telegram_bots/types';

function TelegramBots(): ReactElement {
	const { t } = useTranslation(RouteID.TelegramBots);

	const { telegramBots: initialTelegramBots } = useTelegramBotsRouteLoaderData();

	const telegramBotsState = useState<TelegramBot[]>(initialTelegramBots);

	return (
		<Page title={t('title')} grid>
			<TelegramBotsContext.Provider value={telegramBotsState}>
				<Header />
				<TelegramBotList />
			</TelegramBotsContext.Provider>
		</Page>
	);
}

export default TelegramBots;
