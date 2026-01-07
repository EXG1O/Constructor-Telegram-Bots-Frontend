import { makeRequest } from 'api/core';

import appendMedia from '../../utils/appendMedia';
import { TelegramBotAPI } from '../telegram-bot';
import { TelegramBot } from '../telegram-bot/types';
import { APIResponse, Data, Invoice } from './types';

export class InvoicesAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'invoices/';
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.InvoicesAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
  static async create(
    telegramBotID: TelegramBot['id'],
    { image, ...data }: Data.InvoicesAPI.Create,
  ) {
    const formData = new FormData();
    if (image) {
      appendMedia(formData, 'image', image);
    }
    formData.append('data', JSON.stringify(data));

    return makeRequest<APIResponse.InvoicesAPI.Create>(
      this.url(telegramBotID),
      'POST',
      formData,
      true,
    );
  }
}

export class InvoiceAPI {
  static url(telegramBotID: TelegramBot['id'], invoiceID: Invoice['id']): string {
    return InvoicesAPI.url(telegramBotID) + `${invoiceID}/`;
  }

  static async get(telegramBotID: TelegramBot['id'], invoiceID: Invoice['id']) {
    return makeRequest<APIResponse.InvoiceAPI.Get>(
      this.url(telegramBotID, invoiceID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    invoiceID: Invoice['id'],
    { image, ...data }: Data.InvoiceAPI.Update,
  ) {
    const formData = new FormData();
    if (image) {
      appendMedia(formData, 'image', image);
    }
    formData.append('data', JSON.stringify(data));

    return makeRequest<APIResponse.InvoiceAPI.Update>(
      this.url(telegramBotID, invoiceID),
      'PUT',
      formData,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    invoiceID: Invoice['id'],
    { image, ...data }: Data.InvoiceAPI.PartialUpdate,
  ) {
    const formData = new FormData();
    if (image) {
      appendMedia(formData, 'image', image);
    }
    formData.append('data', JSON.stringify(data));

    return makeRequest<APIResponse.InvoiceAPI.PartialUpdate>(
      this.url(telegramBotID, invoiceID),
      'PATCH',
      formData,
      true,
    );
  }
  static async delete(telegramBotID: TelegramBot['id'], invoiceID: Invoice['id']) {
    return makeRequest(this.url(telegramBotID, invoiceID), 'DELETE', undefined, true);
  }
}

export class DiagramInvoicesAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'diagram/invoices/';
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.DiagramInvoicesAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
}

export class DiagramInvoiceAPI {
  static url(telegramBotID: TelegramBot['id'], invoiceID: Invoice['id']): string {
    return DiagramInvoicesAPI.url(telegramBotID) + invoiceID + '/';
  }

  static async get(telegramBotID: TelegramBot['id'], invoiceID: Invoice['id']) {
    return makeRequest<APIResponse.DiagramInvoiceAPI.Get>(
      this.url(telegramBotID, invoiceID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    invoiceID: Invoice['id'],
    data: Data.DiagramInvoiceAPI.Update,
  ) {
    return makeRequest<APIResponse.DiagramInvoiceAPI.Update>(
      this.url(telegramBotID, invoiceID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    invoiceID: Invoice['id'],
    data: Data.DiagramInvoiceAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.DiagramInvoiceAPI.PartialUpdate>(
      this.url(telegramBotID, invoiceID),
      'PATCH',
      data,
      true,
    );
  }
}
