import { type LoaderFunctionArgs, redirect } from 'react-router-dom';
import i18n from 'i18n';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import type { PaginatedVariableList } from 'api';
import { TelegramBotsService } from 'api';

import reverse from 'utils/reverse';

export type VariablePagination = PaginatedVariableList;

export interface LoaderData {
  pagination: VariablePagination;
}

const defaultLimit: VariablePagination['limit'] = 10;

async function loader({ params }: LoaderFunctionArgs): Promise<LoaderData> {
  const fallback = () => {
    createMessageToast({
      message: i18n.t('messages.loader.error'),
      level: 'error',
    });
    return redirect(reverse(RouteID.TelegramBots));
  };

  const telegramBotID = Number(params.telegramBotID);

  if (Number.isNaN(telegramBotID)) {
    throw fallback();
  }

  const { data, error } = await TelegramBotsService.getVariableList({
    path: { telegramBotId: telegramBotID },
    query: { limit: defaultLimit },
  });

  if (error || !data) {
    throw fallback();
  }

  return { pagination: data };
}

export default loader;
