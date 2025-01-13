import { TelegramBotsAPI } from 'api/telegram_bots/main';
import { APIResponse } from 'api/telegram_bots/types';

export interface LoaderData {
	telegramBots: APIResponse.TelegramBotsAPI.Get;
}

async function loader(): Promise<LoaderData | null> {
	const response = await TelegramBotsAPI.get();

	if (!response.ok) return null;

	return { telegramBots: response.json };
}

export default loader;
