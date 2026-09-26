import { type LoaderFunctionArgs, redirect } from 'react-router-dom';
import i18n from 'i18n';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import type { PaginatedVariableList } from 'api';
import { TelegramBotsService } from 'api';

import reverse from 'utils/reverse';

export interface PaginationOptions {
  limit: number;
  offset: number;
}

export type VariablePagination = PaginatedVariableList & PaginationOptions;

export interface LoaderData {
  pagination: VariablePagination;
}

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

  const pagination: PaginationOptions = { limit: 10, offset: 0 };

  const { data, error } = await TelegramBotsService.getVariableList({
    path: { telegramBotId: telegramBotID },
    query: pagination,
  });

  if (error || !data) {
    throw fallback();
  }

  return { pagination: { ...data, ...pagination } };
}

export default loader;
