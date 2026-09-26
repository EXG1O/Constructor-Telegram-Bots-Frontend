import { type LoaderFunctionArgs, redirect } from 'react-router-dom';
import i18n from 'i18n';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import type { PaginatedChatList, PaginatedTelegramBotUserList } from 'api';
import { TelegramBotsService } from 'api';

import reverse from 'utils/reverse';

export interface PaginationOptions {
  limit: number;
  offset: number;
}

export type ChatPagination = PaginatedChatList & PaginationOptions;
export type UserPagination = PaginatedTelegramBotUserList & PaginationOptions;

export interface LoaderData {
  chatPagination: ChatPagination;
  userPagination: UserPagination;
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

  const [limit, offset] = [20, 0];

  try {
    const [chatsResult, usersResult] = await Promise.all([
      TelegramBotsService.getChatList({
        path: { telegramBotId: telegramBotID },
        query: { limit, offset },
        throwOnError: true,
      }),
      TelegramBotsService.getUserList({
        path: { telegramBotId: telegramBotID },
        query: { limit, offset },
        throwOnError: true,
      }),
    ]);

    const pagination: PaginationOptions = { limit, offset };

    return {
      chatPagination: { ...chatsResult.data, ...pagination },
      userPagination: { ...usersResult.data, ...pagination },
    };
  } catch {
    throw fallback();
  }
}

export default loader;
