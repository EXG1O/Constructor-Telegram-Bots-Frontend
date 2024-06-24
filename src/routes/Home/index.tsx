import React, { ReactElement } from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Page from 'components/Page';

import { DonationsAPI } from 'services/api/donations/main';
import { APIResponse as DonationsAPIResponse } from 'services/api/donations/types';
import { StatsAPI as TelegramBotsStatsAPI } from 'services/api/telegram_bots/main';
import { APIResponse as TelegramBotsAPIResponse } from 'services/api/telegram_bots/types';
import { StatsAPI as UsersStatsAPI } from 'services/api/users/main';
import { APIResponse as UsersAPIResponse } from 'services/api/users/types';

import Donations from './components/Donations';
import Header from './components/Header';
import Stats from './components/Stats';

interface LoaderDataStats {
	users: UsersAPIResponse.StatsAPI.Get;
	telegramBots: TelegramBotsAPIResponse.StatsAPI.Get;
}

export interface LoaderData {
	stats: LoaderDataStats;
	donations: DonationsAPIResponse.DonationsAPI.Get.Pagination;
}

export async function loader(): Promise<LoaderData> {
	const [usersStatsResponse, telegramBotsResponse, donationsResponse] =
		await Promise.all([
			UsersStatsAPI.get(),
			TelegramBotsStatsAPI.get(),
			DonationsAPI.get(20),
		]);

	if (!usersStatsResponse.ok || !telegramBotsResponse.ok || !donationsResponse.ok) {
		throw Error('Failed to fetch data!');
	}

	return {
		stats: {
			users: usersStatsResponse.json,
			telegramBots: telegramBotsResponse.json,
		},
		donations: donationsResponse.json,
	};
}

function Home(): ReactElement {
	return (
		<Page title={gettext('Бесплатный конструктор Telegram ботов')} align='center'>
			<Row className='g-3 g-lg-4'>
				<Col xs={12}>
					<Header />
				</Col>
				<Col xs={12} lg={6}>
					<Stats />
				</Col>
				<Col xs={12} lg={6}>
					<Donations />
				</Col>
			</Row>
		</Page>
	);
}

export default Home;
