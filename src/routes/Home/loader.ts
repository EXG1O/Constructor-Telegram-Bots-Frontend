import { DonationsAPI } from 'services/api/donations/main';
import { APIResponse as DonationsAPIResponse } from 'services/api/donations/types';
import { StatsAPI as TelegramBotsStatsAPI } from 'services/api/telegram_bots/main';
import { APIResponse as TelegramBotsAPIResponse } from 'services/api/telegram_bots/types';
import { StatsAPI as UsersStatsAPI } from 'services/api/users/main';
import { APIResponse as UsersAPIResponse } from 'services/api/users/types';

interface Stats {
	users: UsersAPIResponse.StatsAPI.Get;
	telegramBots: TelegramBotsAPIResponse.StatsAPI.Get;
}

export interface LoaderData {
	stats: Stats;
	donations: DonationsAPIResponse.DonationsAPI.Get.Pagination;
}

async function loader(): Promise<LoaderData> {
	const [usersStatsResponse, telegramBotsResponse, donationsResponse] =
		await Promise.all([
			UsersStatsAPI.get(),
			TelegramBotsStatsAPI.get(),
			DonationsAPI.get(20),
		]);

	if (!usersStatsResponse.ok || !telegramBotsResponse.ok || !donationsResponse.ok) {
		throw Error('Failed to fetch data.');
	}

	return {
		stats: {
			users: usersStatsResponse.json,
			telegramBots: telegramBotsResponse.json,
		},
		donations: donationsResponse.json,
	};
}

export default loader;
