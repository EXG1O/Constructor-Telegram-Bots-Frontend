import { Params, redirect } from 'react-router-dom';

import { RouteID } from 'routes';

import { TelegramBotAPI } from 'api/telegram-bots/telegram-bot';

import reverse from 'utils/reverse';

import { useTelegramBotStore } from './store';

async function loader({
  params,
}: {
  params: Params<'telegramBotID'>;
}): Promise<Response | null> {
  const telegramBotID = Number(params.telegramBotID);
  const redirectToTelegramBots = () => redirect(reverse(RouteID.TelegramBots));

  if (Number.isNaN(telegramBotID)) {
    return redirectToTelegramBots();
  }

  const response = await TelegramBotAPI.get(telegramBotID);
  const setTelegramBot = useTelegramBotStore.getState().setTelegramBot;

  if (!response.ok) {
    setTelegramBot(null);
    return redirectToTelegramBots();
  }

  setTelegramBot(response.json);
  return null;
}

export default loader;
