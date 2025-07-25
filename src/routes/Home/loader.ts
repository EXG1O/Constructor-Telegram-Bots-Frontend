import { DonationsAPI } from 'api/donations';
import { APIResponse as DonationsAPIResponse } from 'api/donations/types';
import { StatsAPI as TelegramBotsStatsAPI } from 'api/telegram-bots/stats';
import { APIResponse as TelegramBotsStatsAPIResponse } from 'api/telegram-bots/stats/types';
import { StatsAPI as UsersStatsAPI } from 'api/users';
import { APIResponse as UsersAPIResponse } from 'api/users/types';

interface Stats {
  users: UsersAPIResponse.StatsAPI.Get;
  telegramBots: TelegramBotsStatsAPIResponse.StatsAPI.Get;
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
