import type { Params } from 'react-router-dom';

import { ChatsAPI } from 'api/telegram-bots/chat';
import type { APIResponse as ChatAPIResponse } from 'api/telegram-bots/chat/types';
import { UsersAPI } from 'api/telegram-bots/user';
import type { APIResponse as UserAPIResponse } from 'api/telegram-bots/user/types';

export interface PaginationOptions {
  limit: number;
  offset: number;
}

export interface ChatPagination
  extends ChatAPIResponse.ChatsAPI.Get.Pagination, PaginationOptions {}

export interface UserPagination
  extends UserAPIResponse.UsersAPI.Get.Pagination, PaginationOptions {}

export interface LoaderData {
  chatPagination: ChatPagination;
  userPagination: UserPagination;
}

async function loader({
  params,
}: {
  params: Params<'telegramBotID'>;
}): Promise<LoaderData | null> {
  const telegramBotID = Number(params.telegramBotID);
  if (Number.isNaN(telegramBotID)) return null;

  const [limit, offset] = [20, 0];

  const [chatsResponse, usersResponse] = await Promise.all([
    ChatsAPI.get(telegramBotID, limit, offset),
    UsersAPI.get(telegramBotID, limit, offset),
  ]);
  if (!chatsResponse.ok || !usersResponse.ok) return null;

  const pagination: PaginationOptions = { limit, offset };

  return {
    chatPagination: { ...chatsResponse.json, ...pagination },
    userPagination: { ...usersResponse.json, ...pagination },
  };
}

export default loader;
