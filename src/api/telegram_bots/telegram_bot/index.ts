import { ROOT_URL } from '..';

import { makeRequest } from 'api/core';

import { APIResponse, Data, TelegramBot } from './types';

export class TelegramBotsAPI {
  static url: string = ROOT_URL;

  static async get() {
    return makeRequest<APIResponse.TelegramBotsAPI.Get>(
      this.url,
      'GET',
      undefined,
      true,
    );
  }
  static async create(data: Data.TelegramBotsAPI.Create) {
    return makeRequest<APIResponse.TelegramBotsAPI.Create>(
      this.url,
      'POST',
      data,
      true,
    );
  }
}

export class TelegramBotAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return ROOT_URL + `${telegramBotID}/`;
  }

  static async start(telegramBotID: TelegramBot['id']) {
    return makeRequest(this.url(telegramBotID) + 'start/', 'POST', undefined, true);
  }
  static async restart(telegramBotID: TelegramBot['id']) {
    return makeRequest(this.url(telegramBotID) + 'restart/', 'POST', undefined, true);
  }
  static async stop(telegramBotID: TelegramBot['id']) {
    return makeRequest(this.url(telegramBotID) + 'stop/', 'POST', undefined, true);
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.TelegramBotAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    data: Data.TelegramBotAPI.Update,
  ) {
    return makeRequest<APIResponse.TelegramBotAPI.Update>(
      this.url(telegramBotID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    data: Data.TelegramBotAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.TelegramBotAPI.PartialUpdate>(
      this.url(telegramBotID),
      'PATCH',
      data,
      true,
    );
  }
  static async delete(telegramBotID: TelegramBot['id']) {
    return makeRequest(this.url(telegramBotID), 'DELETE', undefined, true);
  }
}
