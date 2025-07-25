import { makeRequest } from 'api/core';

import { TelegramBotAPI } from '../telegram-bot';
import { TelegramBot } from '../telegram-bot/types';
import { APIResponse, BackgroundTask, Data } from './types';

export class BackgroundTasksAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'background-tasks/';
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.BackgroundTasksAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
  static async create(
    telegramBotID: TelegramBot['id'],
    data: Data.BackgroundTasksAPI.Create,
  ) {
    return makeRequest<APIResponse.BackgroundTasksAPI.Create>(
      this.url(telegramBotID),
      'POST',
      data,
      true,
    );
  }
}

export class BackgroundTaskAPI {
  static url(
    telegramBotID: TelegramBot['id'],
    backgroundTaskID: BackgroundTask['id'],
  ): string {
    return BackgroundTasksAPI.url(telegramBotID) + `${backgroundTaskID}/`;
  }

  static async get(
    telegramBotID: TelegramBot['id'],
    backgroundTaskID: BackgroundTask['id'],
  ) {
    return makeRequest<APIResponse.BackgroundTaskAPI.Get>(
      this.url(telegramBotID, backgroundTaskID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    backgroundTaskID: BackgroundTask['id'],
    data: Data.BackgroundTaskAPI.Update,
  ) {
    return makeRequest<APIResponse.BackgroundTaskAPI.Update>(
      this.url(telegramBotID, backgroundTaskID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    backgroundTaskID: BackgroundTask['id'],
    data: Data.BackgroundTaskAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.BackgroundTaskAPI.PartialUpdate>(
      this.url(telegramBotID, backgroundTaskID),
      'PATCH',
      data,
      true,
    );
  }
  static async delete(
    telegramBotID: TelegramBot['id'],
    backgroundTaskID: BackgroundTask['id'],
  ) {
    return makeRequest(
      this.url(telegramBotID, backgroundTaskID),
      'DELETE',
      undefined,
      true,
    );
  }
}

export class DiagramBackgroundTasksAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'diagram/background-tasks/';
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.DiagramBackgroundTasksAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
}

export class DiagramBackgroundTaskAPI {
  static url(
    telegramBotID: TelegramBot['id'],
    backgroundTaskID: BackgroundTask['id'],
  ): string {
    return DiagramBackgroundTasksAPI.url(telegramBotID) + backgroundTaskID + '/';
  }

  static async get(
    telegramBotID: TelegramBot['id'],
    backgroundTaskID: BackgroundTask['id'],
  ) {
    return makeRequest<APIResponse.DiagramBackgroundTaskAPI.Get>(
      this.url(telegramBotID, backgroundTaskID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    backgroundTaskID: BackgroundTask['id'],
    data: Data.DiagramBackgroundTaskAPI.Update,
  ) {
    return makeRequest<APIResponse.DiagramBackgroundTaskAPI.Update>(
      this.url(telegramBotID, backgroundTaskID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    backgroundTaskID: BackgroundTask['id'],
    data: Data.DiagramBackgroundTaskAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.DiagramBackgroundTaskAPI.PartialUpdate>(
      this.url(telegramBotID, backgroundTaskID),
      'PATCH',
      data,
      true,
    );
  }
}
