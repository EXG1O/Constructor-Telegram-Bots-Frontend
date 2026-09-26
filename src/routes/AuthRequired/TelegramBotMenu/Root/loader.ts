import { type LoaderFunctionArgs, redirect } from 'react-router-dom';
import i18n from 'i18n';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import { TelegramBotsService } from 'api';

import reverse from 'utils/reverse';

import { useTelegramBotStore } from './store';

async function loader({ params }: LoaderFunctionArgs): Promise<null> {
  const telegramBotID = Number(params.telegramBotID);

  if (Number.isNaN(telegramBotID)) {
    throw redirect(reverse(RouteID.TelegramBots));
  }

  const { data, error } = await TelegramBotsService.getTelegramBot({
    path: { id: telegramBotID },
  });
  const setTelegramBot = useTelegramBotStore.getState().setTelegramBot;

  if (error || !data) {
    setTelegramBot(null);
    createMessageToast({
      message: i18n.t('messages.loader.error'),
      level: 'error',
    });
    throw redirect(reverse(RouteID.TelegramBots));
  }

  setTelegramBot(data);
  return null;
}

export default loader;
