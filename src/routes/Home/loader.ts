import { StatsAPI as TelegramBotsStatsAPI } from 'api/telegram-bots/stats';
import type { APIResponse as TelegramBotsStatsAPIResponse } from 'api/telegram-bots/stats/types';
import { StatsAPI as UsersStatsAPI } from 'api/users';
import type { APIResponse as UsersAPIResponse } from 'api/users/types';

interface Stats {
  users: UsersAPIResponse.StatsAPI.Get;
  telegramBots: TelegramBotsStatsAPIResponse.StatsAPI.Get;
}

export interface LoaderData {
  stats: Stats;
}

async function loader(): Promise<LoaderData> {
  const [usersStatsResponse, telegramBotsResponse] = await Promise.all([
    UsersStatsAPI.get(),
    TelegramBotsStatsAPI.get(),
  ]);

  if (!usersStatsResponse.ok || !telegramBotsResponse.ok) {
    throw Error('Failed to fetch data.');
  }

  return {
    stats: {
      users: usersStatsResponse.json,
      telegramBots: telegramBotsResponse.json,
    },
  };
}

export default loader;
