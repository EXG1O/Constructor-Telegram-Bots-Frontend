import { makeRequest } from 'api/core';

import { TelegramBotAPI } from '../telegram_bot';
import { TelegramBot } from '../telegram_bot/types';
import { APIResponse, Connection, Data } from './types';

export class ConnectionsAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'connections/';
  }

  static async create(
    telegramBotID: TelegramBot['id'],
    data: Data.ConnectionsAPI.Create,
  ) {
    return makeRequest<APIResponse.ConnectionsAPI.Create>(
      this.url(telegramBotID),
      'POST',
      data,
      true,
    );
  }
}

export class ConnectionAPI {
  static url(telegramBotID: TelegramBot['id'], connectionID: Connection['id']): string {
    return ConnectionsAPI.url(telegramBotID) + `${connectionID}/`;
  }

  static async delete(
    telegramBotID: TelegramBot['id'],
    connectionID: Connection['id'],
  ) {
    return makeRequest(
      this.url(telegramBotID, connectionID),
      'DELETE',
      undefined,
      true,
    );
  }
}
