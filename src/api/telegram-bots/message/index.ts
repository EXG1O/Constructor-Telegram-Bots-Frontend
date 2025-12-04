import { makeRequest } from 'api/core';

import { TelegramBotAPI } from '../telegram-bot';
import { TelegramBot } from '../telegram-bot/types';
import { APIResponse, Data, Message } from './types';

export class MessagesAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'messages/';
  }

  static parseMedia(
    index: number,
    formData: FormData,
    mediaType: 'image' | 'document',
    { file, from_url, ...extraData }: Data.MessagesAPI.CreateMessageMedia,
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
    return makeRequest<APIResponse.MessagesAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
  static async create(
    telegramBotID: TelegramBot['id'],
    { images, documents, ...data }: Data.MessagesAPI.Create,
  ) {
    const formData = new FormData();
    images?.forEach((media, index) =>
      MessagesAPI.parseMedia(index, formData, 'image', media),
    );
    documents?.forEach((media, index) =>
      MessagesAPI.parseMedia(index, formData, 'document', media),
    );
    formData.append('data', JSON.stringify(data));

    return makeRequest<APIResponse.MessagesAPI.Create>(
      this.url(telegramBotID),
      'POST',
      formData,
      true,
    );
  }
}

export class MessageAPI {
  static url(telegramBotID: TelegramBot['id'], messageID: Message['id']): string {
    return MessagesAPI.url(telegramBotID) + `${messageID}/`;
  }

  static parseMedia(
    index: number,
    formData: FormData,
    mediaType: 'image' | 'document',
    { id, file, from_url, ...extraData }: Partial<Data.MessageAPI.UpdateMessageMedia>,
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

  static async get(telegramBotID: TelegramBot['id'], messageID: Message['id']) {
    return makeRequest<APIResponse.MessageAPI.Get>(
      this.url(telegramBotID, messageID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    messageID: Message['id'],
    { images, documents, ...data }: Data.MessageAPI.Update,
  ) {
    const formData = new FormData();
    images?.forEach((media, index) =>
      MessageAPI.parseMedia(index, formData, 'image', media),
    );
    documents?.forEach((media, index) =>
      MessageAPI.parseMedia(index, formData, 'document', media),
    );
    formData.append('data', JSON.stringify(data));

    return makeRequest<APIResponse.MessageAPI.Update>(
      this.url(telegramBotID, messageID),
      'PUT',
      formData,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    messageID: Message['id'],
    { images, documents, ...data }: Data.MessageAPI.PartialUpdate,
  ) {
    const formData = new FormData();
    images?.forEach((media, index) =>
      MessageAPI.parseMedia(index, formData, 'image', media),
    );
    documents?.forEach((media, index) =>
      MessageAPI.parseMedia(index, formData, 'document', media),
    );
    formData.append('data', JSON.stringify(data));

    return makeRequest<APIResponse.MessageAPI.PartialUpdate>(
      this.url(telegramBotID, messageID),
      'PATCH',
      formData,
      true,
    );
  }
  static async delete(telegramBotID: TelegramBot['id'], messageID: Message['id']) {
    return makeRequest(this.url(telegramBotID, messageID), 'DELETE', undefined, true);
  }
}

export class DiagramMessagesAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'diagram/messages/';
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.DiagramMessagesAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
}

export class DiagramMessageAPI {
  static url(telegramBotID: TelegramBot['id'], messageID: Message['id']): string {
    return DiagramMessagesAPI.url(telegramBotID) + messageID + '/';
  }

  static async get(telegramBotID: TelegramBot['id'], messageID: Message['id']) {
    return makeRequest<APIResponse.DiagramMessageAPI.Get>(
      this.url(telegramBotID, messageID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    messageID: Message['id'],
    data: Data.DiagramMessageAPI.Update,
  ) {
    return makeRequest<APIResponse.DiagramMessageAPI.Update>(
      this.url(telegramBotID, messageID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    messageID: Message['id'],
    data: Data.DiagramMessageAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.DiagramMessageAPI.PartialUpdate>(
      this.url(telegramBotID, messageID),
      'PATCH',
      data,
      true,
    );
  }
}
