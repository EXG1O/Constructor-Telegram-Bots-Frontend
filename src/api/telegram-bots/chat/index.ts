import { makeRequest } from 'api/core';

import { TelegramBotAPI } from '../telegram-bot';
import type { TelegramBot } from '../telegram-bot/types';
import type { ChatType } from './enums';
import type { APIResponse, Chat, Data } from './types';

export class ChatsAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'chats/';
  }

  static async get<Limit extends number | undefined>(
    telegramBotID: TelegramBot['id'],
    limit: Limit,
    offset?: number,
    search?: string,
    type?: ChatType,
    filter?: 'is_allowed' | 'is_blocked',
  ) {
    let url: string = this.url(telegramBotID);

    if (limit || offset || search || type) {
      const params = new URLSearchParams();
      limit && params.set('limit', limit.toString());
      offset && params.set('offset', offset.toString());
      search && params.set('search', search);
      filter && params.set(filter, 'True');
      type && params.set('type', type);
      url += `?${params.toString()}`;
    }

    return makeRequest<
      Limit extends number
        ? APIResponse.ChatsAPI.Get.Pagination
        : APIResponse.ChatsAPI.Get.Default
    >(url, 'GET', undefined, true);
  }
}

export class ChatAPI {
  static url(telegramBotID: TelegramBot['id'], chatID: Chat['id']): string {
    return `${ChatsAPI.url(telegramBotID)}${chatID}/`;
  }

  static async get(telegramBotID: TelegramBot['id'], chatID: Chat['id']) {
    return makeRequest<APIResponse.ChatAPI.Get>(
      this.url(telegramBotID, chatID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    chatID: Chat['id'],
    data: Data.ChatAPI.Update,
  ) {
    return makeRequest<APIResponse.ChatAPI.Update>(
      this.url(telegramBotID, chatID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    chatID: Chat['id'],
    data: Data.ChatAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.ChatAPI.PartialUpdate>(
      this.url(telegramBotID, chatID),
      'PATCH',
      data,
      true,
    );
  }
  static async delete(telegramBotID: TelegramBot['id'], chatID: Chat['id']) {
    return makeRequest(this.url(telegramBotID, chatID), 'DELETE', undefined, true);
  }
}
