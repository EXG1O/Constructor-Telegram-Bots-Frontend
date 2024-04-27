import React, { ReactElement } from 'react';

import Container from 'react-bootstrap/Container';

import Title from 'components/Title';

import Header from './components/Header';
import Stats from './components/Stats';
import Donations from './components/Donations';

import { StatsAPI as UsersStatsAPI } from 'services/api/users/main';
import { APIResponse as UsersAPIResponse } from 'services/api/users/types';

import { StatsAPI as TelegramBotsStatsAPI } from 'services/api/telegram_bots/main';
import { APIResponse as TelegramBotsAPIResponse } from 'services/api/telegram_bots/types';

import { DonationsAPI } from 'services/api/donations/main';
import { APIResponse as DonationsAPIResponse } from 'services/api/donations/types';

interface LoaderDataStats {
	users: UsersAPIResponse.StatsAPI.Get;
	telegramBots: TelegramBotsAPIResponse.StatsAPI.Get;
}

export interface LoaderData {
	stats: LoaderDataStats;
	donations: DonationsAPIResponse.DonationsAPI.Get.Pagination;
}

export async function loader(): Promise<LoaderData> {
	const [
		usersStatsResponse,
		telegramBotsResponse,
		donationsResponse,
	] = await Promise.all([
		UsersStatsAPI.get(),
		TelegramBotsStatsAPI.get(),
		DonationsAPI.get(20),
	]);

	if (
		!usersStatsResponse.ok ||
		!telegramBotsResponse.ok ||
		!donationsResponse.ok
	) {
		throw Error('Failed to fetch data!');
	}

	return {
		stats: {
			users: usersStatsResponse.json,
			telegramBots: telegramBotsResponse.json,
		},
		donations: donationsResponse.json,
	}
}

function Home(): ReactElement {
	return (
		<Title title={gettext('Бесплатный конструктор Telegram ботов')}>
			<main className='my-auto'>
				<Container className='vstack justify-content-center align-items-center text-center gap-3 my-3 my-lg-4'>
					<Header />
					<Stats />
					<Donations />
				</Container>
			</main>
		</Title>
	);
}

export default Home;