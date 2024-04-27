import React, { ReactElement, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import Title from 'components/Title';

import Header from './components/Header';
import TelegramBotList from './components/TelegramBotList';

import TelegramBotsContext from './services/contexts/TelegramBotsContext';

import { TelegramBotsAPI } from 'services/api/telegram_bots/main';
import { TelegramBot, APIResponse } from 'services/api/telegram_bots/types';

export interface LoaderData {
	telegramBots: APIResponse.TelegramBotsAPI.Get;
}

export async function loader(): Promise<LoaderData> {
	const response = await TelegramBotsAPI.get();

	if (!response.ok) {
		throw Error('Failed to fetch data!');
	}

	return { telegramBots: response.json };
}

function PersonalCabinet(): ReactElement {
	const { telegramBots: initialTelegramBots } = useRouteLoaderData('personal-cabinet') as LoaderData;

	const telegramBotsState = useState<TelegramBot[]>(initialTelegramBots);

	return (
		<Title title={gettext('Личный кабинет')}>
			<Container as='main' className='vstack gap-3 gap-lg-4 my-3 my-lg-4'>
				<TelegramBotsContext.Provider value={telegramBotsState}>
					<Header />
					<TelegramBotList />
				</TelegramBotsContext.Provider>
			</Container>
		</Title>
	);
}

export default PersonalCabinet;