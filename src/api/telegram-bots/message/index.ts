import { makeRequest } from 'api/core';

import appendMedia from '../../utils/appendMedia';
import { TelegramBotAPI } from '../telegram-bot';
import { TelegramBot } from '../telegram-bot/types';
import { APIResponse, Data, Message } from './types';

export class MessagesAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'messages/';
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
    if (images) {
      appendMedia(formData, 'images', images);
    }
    if (documents) {
      appendMedia(formData, 'documents', documents);
    }
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
    if (images) {
      appendMedia(formData, 'images', images);
    }
    if (documents) {
      appendMedia(formData, 'documents', documents);
    }
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
    if (images) {
      appendMedia(formData, 'images', images);
    }
    if (documents) {
      appendMedia(formData, 'documents', documents);
    }
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
