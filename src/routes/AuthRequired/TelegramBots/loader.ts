import { TelegramBotsAPI } from 'api/telegram_bots/main';
import { APIResponse } from 'api/telegram_bots/types';

export interface LoaderData {
	telegramBots: APIResponse.TelegramBotsAPI.Get;
}

async function loader(): Promise<LoaderData> {
	const response = await TelegramBotsAPI.get();

	if (!response.ok) {
		throw Error('Failed to fetch data.');
	}

	return { telegramBots: response.json };
}

export default loader;
