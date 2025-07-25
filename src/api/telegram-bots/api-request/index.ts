import { makeRequest } from 'api/core';

import { TelegramBotAPI } from '../telegram-bot';
import { TelegramBot } from '../telegram-bot/types';
import { APIRequest, APIResponse, Data } from './types';

export class APIRequestsAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'api-requests/';
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.APIRequestsAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
  static async create(
    telegramBotID: TelegramBot['id'],
    data: Data.APIRequestsAPI.Create,
  ) {
    return makeRequest<APIResponse.APIRequestsAPI.Create>(
      this.url(telegramBotID),
      'POST',
      data,
      true,
    );
  }
}

export class APIRequestAPI {
  static url(telegramBotID: TelegramBot['id'], requestID: APIRequest['id']): string {
    return APIRequestsAPI.url(telegramBotID) + `${requestID}/`;
  }

  static async get(telegramBotID: TelegramBot['id'], requestID: APIRequest['id']) {
    return makeRequest<APIResponse.APIRequestAPI.Get>(
      this.url(telegramBotID, requestID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    requestID: APIRequest['id'],
    data: Data.APIRequestAPI.Update,
  ) {
    return makeRequest<APIResponse.APIRequestAPI.Update>(
      this.url(telegramBotID, requestID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    requestID: APIRequest['id'],
    data: Data.APIRequestAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.APIRequestAPI.PartialUpdate>(
      this.url(telegramBotID, requestID),
      'PATCH',
      data,
      true,
    );
  }
  static async delete(telegramBotID: TelegramBot['id'], requestID: APIRequest['id']) {
    return makeRequest(this.url(telegramBotID, requestID), 'DELETE', undefined, true);
  }
}

export class DiagramAPIRequestsAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'diagram/api-requests/';
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.DiagramAPIRequestsAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
}

export class DiagramAPIRequestAPI {
  static url(telegramBotID: TelegramBot['id'], requestID: APIRequest['id']): string {
    return DiagramAPIRequestsAPI.url(telegramBotID) + requestID + '/';
  }

  static async get(telegramBotID: TelegramBot['id'], requestID: APIRequest['id']) {
    return makeRequest<APIResponse.DiagramAPIRequestAPI.Get>(
      this.url(telegramBotID, requestID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    requestID: APIRequest['id'],
    data: Data.DiagramAPIRequestAPI.Update,
  ) {
    return makeRequest<APIResponse.DiagramAPIRequestAPI.Update>(
      this.url(telegramBotID, requestID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    requestID: APIRequest['id'],
    data: Data.DiagramAPIRequestAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.DiagramAPIRequestAPI.PartialUpdate>(
      this.url(telegramBotID, requestID),
      'PATCH',
      data,
      true,
    );
  }
}
