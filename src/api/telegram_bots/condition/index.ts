import { makeRequest } from 'api/core';

import { TelegramBotAPI } from '../telegram_bot';
import { TelegramBot } from '../telegram_bot/types';
import { APIResponse, Condition, Data } from './types';

export class ConditionsAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'conditions/';
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.ConditionsAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
  static async create(
    telegramBotID: TelegramBot['id'],
    data: Data.ConditionsAPI.Create,
  ) {
    return makeRequest<APIResponse.ConditionsAPI.Create>(
      this.url(telegramBotID),
      'POST',
      data,
      true,
    );
  }
}

export class ConditionAPI {
  static url(telegramBotID: TelegramBot['id'], conditionID: Condition['id']): string {
    return ConditionsAPI.url(telegramBotID) + `${conditionID}/`;
  }

  static async get(telegramBotID: TelegramBot['id'], conditionID: Condition['id']) {
    return makeRequest<APIResponse.ConditionAPI.Get>(
      this.url(telegramBotID, conditionID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    conditionID: Condition['id'],
    data: Data.ConditionAPI.Update,
  ) {
    return makeRequest<APIResponse.ConditionAPI.Update>(
      this.url(telegramBotID, conditionID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    conditionID: Condition['id'],
    data: Data.ConditionAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.ConditionAPI.PartialUpdate>(
      this.url(telegramBotID, conditionID),
      'PATCH',
      data,
      true,
    );
  }
  static async delete(telegramBotID: TelegramBot['id'], conditionID: Condition['id']) {
    return makeRequest(this.url(telegramBotID, conditionID), 'DELETE', undefined, true);
  }
}

export class DiagramConditionsAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'diagram/conditions/';
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.DiagramConditionsAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
}

export class DiagramConditionAPI {
  static url(telegramBotID: TelegramBot['id'], conditionID: Condition['id']): string {
    return DiagramConditionsAPI.url(telegramBotID) + conditionID + '/';
  }

  static async get(telegramBotID: TelegramBot['id'], conditionID: Condition['id']) {
    return makeRequest<APIResponse.DiagramConditionAPI.Get>(
      this.url(telegramBotID, conditionID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    conditionID: Condition['id'],
    data: Data.DiagramConditionAPI.Update,
  ) {
    return makeRequest<APIResponse.DiagramConditionAPI.Update>(
      this.url(telegramBotID, conditionID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    conditionID: Condition['id'],
    data: Data.DiagramConditionAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.DiagramConditionAPI.PartialUpdate>(
      this.url(telegramBotID, conditionID),
      'PATCH',
      data,
      true,
    );
  }
}
