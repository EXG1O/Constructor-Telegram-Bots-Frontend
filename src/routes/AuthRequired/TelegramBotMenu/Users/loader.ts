import { type LoaderFunctionArgs, redirect } from 'react-router-dom';
import i18n from 'i18n';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import type {
  Options,
  PaginatedChatList,
  PaginatedTelegramBotUserList,
  TelegramBotsGetChatListData,
  TelegramBotsGetUserListData,
} from 'api';
import { TelegramBotsService } from 'api';

import reverse from 'utils/reverse';

export type ChatPagination = PaginatedChatList;
export type UserPagination = PaginatedTelegramBotUserList;

export interface LoaderData {
  chatPagination: ChatPagination;
  userPagination: UserPagination;
}

const defaultLimit: (ChatPagination | UserPagination)['limit'] = 20;

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

  const options: Options<
    TelegramBotsGetChatListData | TelegramBotsGetUserListData,
    true
  > = {
    path: { telegramBotId: telegramBotID },
    query: { limit: defaultLimit },
    throwOnError: true,
  };

  try {
    const [{ data: chatPagination }, { data: userPagination }] = await Promise.all([
      TelegramBotsService.getChatList(options),
      TelegramBotsService.getUserList(options),
    ]);
    return { chatPagination, userPagination };
  } catch {
    throw fallback();
  }
}

export default loader;
