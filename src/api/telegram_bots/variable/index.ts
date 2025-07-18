import { makeRequest } from 'api/core';

import { TelegramBotAPI } from '../telegram_bot';
import { TelegramBot } from '../telegram_bot/types';
import { APIResponse, Data, Variable } from './types';

export class VariablesAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'variables/';
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
        ? APIResponse.VariablesAPI.Get.Pagination
        : APIResponse.VariablesAPI.Get.Default
    >(url, 'GET', undefined, true);
  }
  static async create(
    telegramBotID: TelegramBot['id'],
    data: Data.VariablesAPI.Create,
  ) {
    return makeRequest<APIResponse.VariablesAPI.Create>(
      this.url(telegramBotID),
      'POST',
      data,
      true,
    );
  }
}

export class VariableAPI {
  static url(telegramBotID: TelegramBot['id'], variableID: Variable['id']): string {
    return VariablesAPI.url(telegramBotID) + `${variableID}/`;
  }

  static async get(telegramBotID: TelegramBot['id'], variableID: Variable['id']) {
    return makeRequest<APIResponse.VariableAPI.Get>(
      this.url(telegramBotID, variableID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    variableID: Variable['id'],
    data: Data.VariableAPI.Update,
  ) {
    return makeRequest<APIResponse.VariableAPI.Update>(
      this.url(telegramBotID, variableID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    variableID: Variable['id'],
    data: Data.VariableAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.VariableAPI.PartialUpdate>(
      this.url(telegramBotID, variableID),
      'PATCH',
      data,
      true,
    );
  }
  static async delete(telegramBotID: TelegramBot['id'], variableID: Variable['id']) {
    return makeRequest(this.url(telegramBotID, variableID), 'DELETE', undefined, true);
  }
}
