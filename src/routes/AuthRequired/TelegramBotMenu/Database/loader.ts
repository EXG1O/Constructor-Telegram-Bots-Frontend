import { type LoaderFunctionArgs, redirect } from 'react-router-dom';
import i18n from 'i18n';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import type {
  PaginatedDatabaseRecordList,
  TelegramBotsGetDatabaseRecordListData,
} from 'api';
import { TelegramBotsService } from 'api';

import reverse from 'utils/reverse';

type RecordQuery = NonNullable<TelegramBotsGetDatabaseRecordListData['query']>;

export interface RecordPagination extends PaginatedDatabaseRecordList {
  search: NonNullable<RecordQuery['search']> | null;
}

export interface LoaderData {
  pagination: RecordPagination;
}

const defaultLimit: RecordPagination['limit'] = 10;

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

  const { data, error } = await TelegramBotsService.getDatabaseRecordList({
    path: { telegramBotId: telegramBotID },
    query: { limit: defaultLimit },
  });

  if (error || !data) {
    throw fallback();
  }

  return { pagination: { ...data, search: null } };
}

export default loader;
