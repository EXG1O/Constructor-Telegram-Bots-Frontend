import { makeRequest } from 'api/core';

import { TelegramBotAPI } from '../telegram_bot';
import { TelegramBot } from '../telegram_bot/types';
import { APIResponse, Data, Trigger } from './types';

export class TriggersAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'triggers/';
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.TriggersAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
  static async create(telegramBotID: TelegramBot['id'], data: Data.TriggersAPI.Create) {
    return makeRequest<APIResponse.TriggersAPI.Create>(
      this.url(telegramBotID),
      'POST',
      data,
      true,
    );
  }
}

export class TriggerAPI {
  static url(telegramBotID: TelegramBot['id'], triggerID: Trigger['id']): string {
    return TriggersAPI.url(telegramBotID) + `${triggerID}/`;
  }

  static async get(telegramBotID: TelegramBot['id'], triggerID: Trigger['id']) {
    return makeRequest<APIResponse.TriggerAPI.Get>(
      this.url(telegramBotID, triggerID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    triggerID: Trigger['id'],
    data: Data.TriggerAPI.Update,
  ) {
    return makeRequest<APIResponse.TriggerAPI.Update>(
      this.url(telegramBotID, triggerID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    triggerID: Trigger['id'],
    data: Data.TriggerAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.TriggerAPI.PartialUpdate>(
      this.url(telegramBotID, triggerID),
      'PATCH',
      data,
      true,
    );
  }
  static async delete(telegramBotID: TelegramBot['id'], triggerID: Trigger['id']) {
    return makeRequest(this.url(telegramBotID, triggerID), 'DELETE', undefined, true);
  }
}

export class DiagramTriggersAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'diagram/triggers/';
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.DiagramTriggersAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
}

export class DiagramTriggerAPI {
  static url(telegramBotID: TelegramBot['id'], triggerID: Trigger['id']): string {
    return DiagramTriggersAPI.url(telegramBotID) + triggerID + '/';
  }

  static async get(telegramBotID: TelegramBot['id'], triggerID: Trigger['id']) {
    return makeRequest<APIResponse.DiagramTriggerAPI.Get>(
      this.url(telegramBotID, triggerID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    triggerID: Trigger['id'],
    data: Data.DiagramTriggerAPI.Update,
  ) {
    return makeRequest<APIResponse.DiagramTriggerAPI.Update>(
      this.url(telegramBotID, triggerID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    triggerID: Trigger['id'],
    data: Data.DiagramTriggerAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.DiagramTriggerAPI.PartialUpdate>(
      this.url(telegramBotID, triggerID),
      'PATCH',
      data,
      true,
    );
  }
}
