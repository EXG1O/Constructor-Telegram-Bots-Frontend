import { TelegramBotsAPI } from 'api/telegram-bots/telegram-bot';
import { APIResponse } from 'api/telegram-bots/telegram-bot/types';

export interface LoaderData {
  telegramBots: APIResponse.TelegramBotsAPI.Get;
}

async function loader(): Promise<LoaderData | null> {
  const response = await TelegramBotsAPI.get();

  if (!response.ok) return null;

  return { telegramBots: response.json };
}

export default loader;
