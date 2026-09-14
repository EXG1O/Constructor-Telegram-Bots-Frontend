import { makeRequest } from 'api/core';

import { TelegramBotAPI } from '../telegram-bot';
import type { TelegramBot } from '../telegram-bot/types';
import type { APIResponse, Data, Randomizer } from './types';

interface Options {
  botID: TelegramBot['id'];
}

interface DetailOptions extends Options {
  id: Randomizer['id'];
}

interface DataOption<TData extends Record<string, any>> {
  data: TData;
}

export class RandomizersAPI {
  static getURL({ botID }: Options): string {
    return TelegramBotAPI.url(botID) + 'randomizers/';
  }

  static async get(options: Options) {
    return makeRequest<APIResponse.RandomizersAPI.Get>(
      this.getURL(options),
      'GET',
      undefined,
      true,
    );
  }
  static async create({
    data,
    ...options
  }: Options & DataOption<Data.RandomizersAPI.Create>) {
    return makeRequest<APIResponse.RandomizersAPI.Create>(
      this.getURL(options),
      'POST',
      data,
      true,
    );
  }
}

export class RandomizerAPI {
  static getURL({ id, ...options }: DetailOptions): string {
    return RandomizersAPI.getURL(options) + `${id}/`;
  }

  static async get(options: DetailOptions) {
    return makeRequest<APIResponse.RandomizerAPI.Get>(
      this.getURL(options),
      'GET',
      undefined,
      true,
    );
  }
  static async update({
    data,
    ...options
  }: DetailOptions & DataOption<Data.RandomizerAPI.Update>) {
    return makeRequest<APIResponse.RandomizerAPI.Update>(
      this.getURL(options),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate({
    data,
    ...options
  }: DetailOptions & DataOption<Data.RandomizerAPI.PartialUpdate>) {
    return makeRequest<APIResponse.RandomizerAPI.PartialUpdate>(
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

export class DiagramRandomizersAPI {
  static getURL({ botID }: Options): string {
    return TelegramBotAPI.url(botID) + 'diagram/randomizers/';
  }

  static async get(options: Options) {
    return makeRequest<APIResponse.DiagramRandomizersAPI.Get>(
      this.getURL(options),
      'GET',
      undefined,
      true,
    );
  }
}

export class DiagramRandomizerAPI {
  static getURL({ id, ...options }: DetailOptions): string {
    return DiagramRandomizersAPI.getURL(options) + `${id}/`;
  }

  static async get(options: DetailOptions) {
    return makeRequest<APIResponse.DiagramRandomizerAPI.Get>(
      this.getURL(options),
      'GET',
      undefined,
      true,
    );
  }
  static async update({
    data,
    ...options
  }: DetailOptions & DataOption<Data.DiagramRandomizerAPI.Update>) {
    return makeRequest<APIResponse.DiagramRandomizerAPI.Update>(
      this.getURL(options),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate({
    data,
    ...options
  }: DetailOptions & DataOption<Data.DiagramRandomizerAPI.PartialUpdate>) {
    return makeRequest<APIResponse.DiagramRandomizerAPI.PartialUpdate>(
      this.getURL(options),
      'PATCH',
      data,
      true,
    );
  }
}
