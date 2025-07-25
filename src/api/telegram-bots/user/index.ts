import { makeRequest } from 'api/core';

import { TelegramBotAPI } from '../telegram-bot';
import { TelegramBot } from '../telegram-bot/types';
import { APIResponse, Data, User } from './types';

export class UsersAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'users/';
  }

  static async get<Limit extends number | undefined>(
    telegramBotID: TelegramBot['id'],
    limit: Limit,
    offset?: number,
    search?: string,
    filter?: 'is_allowed' | 'is_blocked',
  ) {
    let url: string = this.url(telegramBotID);

    if (limit || offset || search) {
      const params = new URLSearchParams();
      limit && params.set('limit', limit.toString());
      offset && params.set('offset', offset.toString());
      search && params.set('search', search);
      filter && params.set(filter, 'True');
      url += `?${params.toString()}`;
    }

    return makeRequest<
      Limit extends number
        ? APIResponse.UsersAPI.Get.Pagination
        : APIResponse.UsersAPI.Get.Default
    >(url, 'GET', undefined, true);
  }
}

export class UserAPI {
  static url(telegramBotID: TelegramBot['id'], userID: User['id']): string {
    return `${UsersAPI.url(telegramBotID)}${userID}/`;
  }

  static async get(telegramBotID: TelegramBot['id'], userID: User['id']) {
    return makeRequest<APIResponse.UserAPI.Get>(
      this.url(telegramBotID, userID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    userID: User['id'],
    data: Data.UserAPI.Update,
  ) {
    return makeRequest<APIResponse.UserAPI.Update>(
      this.url(telegramBotID, userID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    userID: User['id'],
    data: Data.UserAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.UserAPI.PartialUpdate>(
      this.url(telegramBotID, userID),
      'PATCH',
      data,
      true,
    );
  }
  static async delete(telegramBotID: TelegramBot['id'], userID: User['id']) {
    return makeRequest(this.url(telegramBotID, userID), 'DELETE', undefined, true);
  }
}
