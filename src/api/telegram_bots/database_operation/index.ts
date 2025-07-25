import { makeRequest } from 'api/core';

import { TelegramBotAPI } from '../telegram_bot';
import { TelegramBot } from '../telegram_bot/types';
import { APIResponse, Data, DatabaseOperation } from './types';

export class DatabaseOperationsAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'database-operations/';
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.DatabaseOperationsAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
  static async create(
    telegramBotID: TelegramBot['id'],
    data: Data.DatabaseOperationsAPI.Create,
  ) {
    return makeRequest<APIResponse.DatabaseOperationsAPI.Create>(
      this.url(telegramBotID),
      'POST',
      data,
      true,
    );
  }
}

export class DatabaseOperationAPI {
  static url(
    telegramBotID: TelegramBot['id'],
    operationID: DatabaseOperation['id'],
  ): string {
    return DatabaseOperationsAPI.url(telegramBotID) + `${operationID}/`;
  }

  static async get(
    telegramBotID: TelegramBot['id'],
    operationID: DatabaseOperation['id'],
  ) {
    return makeRequest<APIResponse.DatabaseOperationAPI.Get>(
      this.url(telegramBotID, operationID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    operationID: DatabaseOperation['id'],
    data: Data.DatabaseOperationAPI.Update,
  ) {
    return makeRequest<APIResponse.DatabaseOperationAPI.Update>(
      this.url(telegramBotID, operationID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    operationID: DatabaseOperation['id'],
    data: Data.DatabaseOperationAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.DatabaseOperationAPI.PartialUpdate>(
      this.url(telegramBotID, operationID),
      'PATCH',
      data,
      true,
    );
  }
  static async delete(
    telegramBotID: TelegramBot['id'],
    operationID: DatabaseOperation['id'],
  ) {
    return makeRequest(this.url(telegramBotID, operationID), 'DELETE', undefined, true);
  }
}

export class DiagramDatabaseOperationsAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'diagram/database-operations/';
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.DiagramDatabaseOperationsAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
}

export class DiagramDatabaseOperationAPI {
  static url(
    telegramBotID: TelegramBot['id'],
    operationID: DatabaseOperation['id'],
  ): string {
    return DiagramDatabaseOperationsAPI.url(telegramBotID) + operationID + '/';
  }

  static async get(
    telegramBotID: TelegramBot['id'],
    operationID: DatabaseOperation['id'],
  ) {
    return makeRequest<APIResponse.DiagramDatabaseOperationAPI.Get>(
      this.url(telegramBotID, operationID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    operationID: DatabaseOperation['id'],
    data: Data.DiagramDatabaseOperationAPI.Update,
  ) {
    return makeRequest<APIResponse.DiagramDatabaseOperationAPI.Update>(
      this.url(telegramBotID, operationID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    operationID: DatabaseOperation['id'],
    data: Data.DiagramDatabaseOperationAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.DiagramDatabaseOperationAPI.PartialUpdate>(
      this.url(telegramBotID, operationID),
      'PATCH',
      data,
      true,
    );
  }
}
