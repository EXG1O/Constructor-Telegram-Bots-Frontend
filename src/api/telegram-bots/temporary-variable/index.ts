import { makeRequest } from 'api/core';

import { TelegramBotAPI } from '../telegram-bot';
import type { TelegramBot } from '../telegram-bot/types';
import type { APIResponse, Data, TemporaryVariable } from './types';

export class TemporaryVariablesAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'temporary-variables/';
  }

  static async get<Limit extends number | undefined>(
    telegramBotID: TelegramBot['id'],
    limit: Limit,
    offset?: number,
  ) {
    let url: string = this.url(telegramBotID);

    if (limit || offset) {
      const params = new URLSearchParams();
      limit && params.set('limit', limit.toString());
      offset && params.set('offset', offset.toString());
      url += `?${params.toString()}`;
    }

    return makeRequest<
      Limit extends number
        ? APIResponse.TemporaryVariablesAPI.Get.Pagination
        : APIResponse.TemporaryVariablesAPI.Get.Default
    >(url, 'GET', undefined, true);
  }
  static async create(
    telegramBotID: TelegramBot['id'],
    data: Data.TemporaryVariablesAPI.Create,
  ) {
    return makeRequest<APIResponse.TemporaryVariablesAPI.Create>(
      this.url(telegramBotID),
      'POST',
      data,
      true,
    );
  }
}

export class TemporaryVariableAPI {
  static url(
    telegramBotID: TelegramBot['id'],
    temporaryVariableID: TemporaryVariable['id'],
  ): string {
    return TemporaryVariablesAPI.url(telegramBotID) + `${temporaryVariableID}/`;
  }

  static async get(
    telegramBotID: TelegramBot['id'],
    temporaryVariableID: TemporaryVariable['id'],
  ) {
    return makeRequest<APIResponse.TemporaryVariableAPI.Get>(
      this.url(telegramBotID, temporaryVariableID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    temporaryVariableID: TemporaryVariable['id'],
    data: Data.TemporaryVariableAPI.Update,
  ) {
    return makeRequest<APIResponse.TemporaryVariableAPI.Update>(
      this.url(telegramBotID, temporaryVariableID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    temporaryVariableID: TemporaryVariable['id'],
    data: Data.TemporaryVariableAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.TemporaryVariableAPI.PartialUpdate>(
      this.url(telegramBotID, temporaryVariableID),
      'PATCH',
      data,
      true,
    );
  }
  static async delete(
    telegramBotID: TelegramBot['id'],
    temporaryVariableID: TemporaryVariable['id'],
  ) {
    return makeRequest(
      this.url(telegramBotID, temporaryVariableID),
      'DELETE',
      undefined,
      true,
    );
  }
}

export class DiagramTemporaryVariablesAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'diagram/temporary-variables/';
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.DiagramTemporaryVariablesAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
}

export class DiagramTemporaryVariableAPI {
  static url(
    telegramBotID: TelegramBot['id'],
    temporaryVariableID: TemporaryVariable['id'],
  ): string {
    return DiagramTemporaryVariablesAPI.url(telegramBotID) + temporaryVariableID + '/';
  }

  static async get(
    telegramBotID: TelegramBot['id'],
    temporaryVariableID: TemporaryVariable['id'],
  ) {
    return makeRequest<APIResponse.DiagramTemporaryVariableAPI.Get>(
      this.url(telegramBotID, temporaryVariableID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    temporaryVariableID: TemporaryVariable['id'],
    data: Data.DiagramTemporaryVariableAPI.Update,
  ) {
    return makeRequest<APIResponse.DiagramTemporaryVariableAPI.Update>(
      this.url(telegramBotID, temporaryVariableID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    temporaryVariableID: TemporaryVariable['id'],
    data: Data.DiagramTemporaryVariableAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.DiagramTemporaryVariableAPI.PartialUpdate>(
      this.url(telegramBotID, temporaryVariableID),
      'PATCH',
      data,
      true,
    );
  }
}
