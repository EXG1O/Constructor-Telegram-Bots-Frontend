import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router-dom';

import Page from 'components/Page';

import Header from './components/Header';
import TelegramBotList from './components/TelegramBotList';
import TelegramBotsContext from './services/contexts/TelegramBotsContext';

import { TelegramBotsAPI } from 'services/api/telegram_bots/main';
import { APIResponse, TelegramBot } from 'services/api/telegram_bots/types';

export interface LoaderData {
	telegramBots: APIResponse.TelegramBotsAPI.Get;
}

export async function loader(): Promise<LoaderData> {
	const response = await TelegramBotsAPI.get();

	if (!response.ok) {
		throw Error('Failed to fetch data.');
	}

	return { telegramBots: response.json };
}

function TelegramBots(): ReactElement {
	const { t } = useTranslation('telegram-bots');

	const { telegramBots: initialTelegramBots } = useRouteLoaderData(
		'telegram-bots',
	) as LoaderData;

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
