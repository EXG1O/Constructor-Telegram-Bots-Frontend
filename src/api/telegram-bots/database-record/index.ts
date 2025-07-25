import { makeRequest } from 'api/core';

import { TelegramBotAPI } from '../telegram-bot';
import { TelegramBot } from '../telegram-bot/types';
import { APIResponse, Data, DatabaseRecord } from './types';

export class DatabaseRecordsAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'database-records/';
  }

  static async get<Limit extends number | undefined>(
    telegramBotID: TelegramBot['id'],
    limit: Limit,
    offset?: number,
    search?: string,
  ) {
    let url: string = this.url(telegramBotID);

    if (limit || offset || search) {
      const params = new URLSearchParams();
      limit && params.set('limit', limit.toString());
      offset && params.set('offset', offset.toString());
      search && params.set('search', search);
      url += `?${params.toString()}`;
    }

    return makeRequest<
      Limit extends number
        ? APIResponse.DatabaseRecordsAPI.Get.Pagination
        : APIResponse.DatabaseRecordsAPI.Get.Default
    >(url, 'GET', undefined, true);
  }
  static async create(
    telegramBotID: TelegramBot['id'],
    data: Data.DatabaseRecordsAPI.Create,
  ) {
    return makeRequest<APIResponse.DatabaseRecordsAPI.Create>(
      this.url(telegramBotID),
      'POST',
      data,
      true,
    );
  }
}

export class DatabaseRecordAPI {
  static url(
    telegramBotID: TelegramBot['id'],
    databaseRecordID: DatabaseRecord['id'],
  ): string {
    return `${DatabaseRecordsAPI.url(telegramBotID)}${databaseRecordID}/`;
  }

  static async get(
    telegramBotID: TelegramBot['id'],
    databaseRecordID: DatabaseRecord['id'],
  ) {
    return makeRequest<APIResponse.DatabaseRecordAPI.Get>(
      this.url(telegramBotID, databaseRecordID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    databaseRecordID: DatabaseRecord['id'],
    data: Data.DatabaseRecordAPI.Update,
  ) {
    return makeRequest<APIResponse.DatabaseRecordAPI.Update>(
      this.url(telegramBotID, databaseRecordID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    databaseRecordID: DatabaseRecord['id'],
    data: Data.DatabaseRecordAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.DatabaseRecordAPI.PartialUpdate>(
      this.url(telegramBotID, databaseRecordID),
      'PATCH',
      data,
      true,
    );
  }
  static async delete(
    telegramBotID: TelegramBot['id'],
    databaseRecordID: DatabaseRecord['id'],
  ) {
    return makeRequest(
      this.url(telegramBotID, databaseRecordID),
      'DELETE',
      undefined,
      true,
    );
  }
}
