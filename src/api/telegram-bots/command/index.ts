import { makeRequest } from 'api/core';

import { TelegramBotAPI } from '../telegram-bot';
import { TelegramBot } from '../telegram-bot/types';
import { APIResponse, Command, Data } from './types';

export class CommandsAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'commands/';
  }

  static parseMedia(
    index: number,
    formData: FormData,
    mediaType: 'image' | 'document',
    { file, from_url, ...extraData }: Data.CommandsAPI.CreateCommandMedia,
  ): void {
    const name: string = `${mediaType}:${index}`;

    if (file) {
      formData.append(name, file, file.name);
    } else if (from_url) {
      formData.append(name, from_url);
    }

    formData.append(`${name}:extra_data`, JSON.stringify(extraData));
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.CommandsAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
  static async create(
    telegramBotID: TelegramBot['id'],
    { images, documents, ...data }: Data.CommandsAPI.Create,
  ) {
    const formData = new FormData();
    images?.forEach((media, index) =>
      CommandsAPI.parseMedia(index, formData, 'image', media),
    );
    documents?.forEach((media, index) =>
      CommandsAPI.parseMedia(index, formData, 'document', media),
    );
    formData.append('data', JSON.stringify(data));

    return makeRequest<APIResponse.CommandsAPI.Create>(
      this.url(telegramBotID),
      'POST',
      formData,
      true,
    );
  }
}

export class CommandAPI {
  static url(telegramBotID: TelegramBot['id'], commandID: Command['id']): string {
    return CommandsAPI.url(telegramBotID) + `${commandID}/`;
  }

  static parseMedia(
    index: number,
    formData: FormData,
    mediaType: 'image' | 'document',
    { id, file, from_url, ...extraData }: Partial<Data.CommandAPI.UpdateCommandMedia>,
  ): void {
    const name: string = `${mediaType}:${index}`;

    if (file) {
      formData.append(name, file, file.name);
    } else if (id) {
      formData.append(name, id.toString());
    } else if (from_url) {
      formData.append(name, from_url);
    }

    formData.append(`${name}:extra_data`, JSON.stringify(extraData));
  }

  static async get(telegramBotID: TelegramBot['id'], commandID: Command['id']) {
    return makeRequest<APIResponse.CommandAPI.Get>(
      this.url(telegramBotID, commandID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    commandID: Command['id'],
    { images, documents, ...data }: Data.CommandAPI.Update,
  ) {
    const formData = new FormData();
    images?.forEach((media, index) =>
      CommandAPI.parseMedia(index, formData, 'image', media),
    );
    documents?.forEach((media, index) =>
      CommandAPI.parseMedia(index, formData, 'document', media),
    );
    formData.append('data', JSON.stringify(data));

    return makeRequest<APIResponse.CommandAPI.Update>(
      this.url(telegramBotID, commandID),
      'PUT',
      formData,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    commandID: Command['id'],
    { images, documents, ...data }: Data.CommandAPI.PartialUpdate,
  ) {
    const formData = new FormData();
    images?.forEach((media, index) =>
      CommandAPI.parseMedia(index, formData, 'image', media),
    );
    documents?.forEach((media, index) =>
      CommandAPI.parseMedia(index, formData, 'document', media),
    );
    formData.append('data', JSON.stringify(data));

    return makeRequest<APIResponse.CommandAPI.PartialUpdate>(
      this.url(telegramBotID, commandID),
      'PATCH',
      formData,
      true,
    );
  }
  static async delete(telegramBotID: TelegramBot['id'], commandID: Command['id']) {
    return makeRequest(this.url(telegramBotID, commandID), 'DELETE', undefined, true);
  }
}

export class DiagramCommandsAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'diagram/commands/';
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.DiagramCommandsAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
}

export class DiagramCommandAPI {
  static url(telegramBotID: TelegramBot['id'], commandID: Command['id']): string {
    return DiagramCommandsAPI.url(telegramBotID) + commandID + '/';
  }

  static async get(telegramBotID: TelegramBot['id'], commandID: Command['id']) {
    return makeRequest<APIResponse.DiagramCommandAPI.Get>(
      this.url(telegramBotID, commandID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    commandID: Command['id'],
    data: Data.DiagramCommandAPI.Update,
  ) {
    return makeRequest<APIResponse.DiagramCommandAPI.Update>(
      this.url(telegramBotID, commandID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    commandID: Command['id'],
    data: Data.DiagramCommandAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.DiagramCommandAPI.PartialUpdate>(
      this.url(telegramBotID, commandID),
      'PATCH',
      data,
      true,
    );
  }
}
