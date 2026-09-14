import { makeRequest } from 'api/core';

import { TelegramBotAPI } from '../telegram-bot';
import type { TelegramBot } from '../telegram-bot/types';
import type { APIResponse, Data, Timer } from './types';

interface Options {
  botID: TelegramBot['id'];
}

interface DetailOptions extends Options {
  id: Timer['id'];
}

interface DataOption<TData extends Record<string, any>> {
  data: TData;
}

export class TimersAPI {
  static getURL({ botID }: Options): string {
    return TelegramBotAPI.url(botID) + 'timers/';
  }

  static async get(options: Options) {
    return makeRequest<APIResponse.TimersAPI.Get>(
      this.getURL(options),
      'GET',
      undefined,
      true,
    );
  }
  static async create({
    data,
    ...options
  }: Options & DataOption<Data.TimersAPI.Create>) {
    return makeRequest<APIResponse.TimersAPI.Create>(
      this.getURL(options),
      'POST',
      data,
      true,
    );
  }
}

export class TimerAPI {
  static getURL({ id, ...options }: DetailOptions): string {
    return TimersAPI.getURL(options) + `${id}/`;
  }

  static async get(options: DetailOptions) {
    return makeRequest<APIResponse.TimerAPI.Get>(
      this.getURL(options),
      'GET',
      undefined,
      true,
    );
  }
  static async update({
    data,
    ...options
  }: DetailOptions & DataOption<Data.TimerAPI.Update>) {
    return makeRequest<APIResponse.TimerAPI.Update>(
      this.getURL(options),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate({
    data,
    ...options
  }: DetailOptions & DataOption<Data.TimerAPI.PartialUpdate>) {
    return makeRequest<APIResponse.TimerAPI.PartialUpdate>(
      this.getURL(options),
      'PATCH',
      data,
      true,
    );
  }
  static async delete(options: DetailOptions) {
    return makeRequest(this.getURL(options), 'DELETE', undefined, true);
  }
}

export class DiagramTimersAPI {
  static getURL({ botID }: Options): string {
    return TelegramBotAPI.url(botID) + 'diagram/timers/';
  }

  static async get(options: Options) {
    return makeRequest<APIResponse.DiagramTimersAPI.Get>(
      this.getURL(options),
      'GET',
      undefined,
      true,
    );
  }
}

export class DiagramTimerAPI {
  static getURL({ id, ...options }: DetailOptions): string {
    return DiagramTimersAPI.getURL(options) + `${id}/`;
  }

  static async get(options: DetailOptions) {
    return makeRequest<APIResponse.DiagramTimerAPI.Get>(
      this.getURL(options),
      'GET',
      undefined,
      true,
    );
  }
  static async update({
    data,
    ...options
  }: DetailOptions & DataOption<Data.DiagramTimerAPI.Update>) {
    return makeRequest<APIResponse.DiagramTimerAPI.Update>(
      this.getURL(options),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate({
    data,
    ...options
  }: DetailOptions & DataOption<Data.DiagramTimerAPI.PartialUpdate>) {
    return makeRequest<APIResponse.DiagramTimerAPI.PartialUpdate>(
      this.getURL(options),
      'PATCH',
      data,
      true,
    );
  }
}
