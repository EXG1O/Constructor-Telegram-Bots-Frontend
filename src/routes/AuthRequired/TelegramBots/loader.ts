import { redirect } from 'react-router-dom';
import i18n from 'i18n';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import type { TelegramBot } from 'api';
import { TelegramBotsService } from 'api';

import reverse from 'utils/reverse';

export interface LoaderData {
  telegramBots: TelegramBot[];
}

async function loader(): Promise<LoaderData> {
  const { data, error } = await TelegramBotsService.getTelegramBotList();

  if (error || !data) {
    createMessageToast({
      message: i18n.t('messages.loader.error'),
      level: 'error',
    });
    throw redirect(reverse(RouteID.Home));
  }

  return { telegramBots: data };
}

export default loader;
