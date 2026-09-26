import {
  type TelegramBotsGetStatsResponse,
  TelegramBotsService,
  type UsersGetStatsResponse,
  UsersService,
} from 'api';

export interface LoaderData {
  stats: {
    users: UsersGetStatsResponse;
    telegramBots: TelegramBotsGetStatsResponse;
  };
}

async function loader(): Promise<LoaderData> {
  const [{ data: userStats }, { data: telegramBotStats }] = await Promise.all([
    UsersService.getStats({ throwOnError: true }),
    TelegramBotsService.getStats({ throwOnError: true }),
  ]);

  return {
    stats: {
      users: userStats,
      telegramBots: telegramBotStats,
    },
  };
}

export default loader;
