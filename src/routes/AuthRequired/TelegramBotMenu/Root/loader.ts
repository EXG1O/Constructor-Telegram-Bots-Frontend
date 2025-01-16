import { Params, redirect } from 'react-router-dom';

import { reverse, RouteID } from 'routes';

import { TelegramBotAPI } from 'api/telegram_bots/main';
import { APIResponse } from 'api/telegram_bots/types';

export interface LoaderData {
	telegramBot: APIResponse.TelegramBotAPI.Get;
}

async function loader({
	params,
}: {
	params: Params<'telegramBotID'>;
}): Promise<Response | LoaderData | null> {
	const { telegramBotID } = params;

	if (telegramBotID === undefined) {
		return redirect(reverse(RouteID.TelegramBots));
	}

	const response = await TelegramBotAPI.get(parseInt(telegramBotID));

	if (!response.ok) return null;

	return { telegramBot: response.json };
}

export default loader;
