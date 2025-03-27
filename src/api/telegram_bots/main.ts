import { makeRequest } from 'api/core';

import {
  APIResponse,
  BackgroundTask,
  Command,
  Condition,
  Connection,
  Data,
  DatabaseRecord,
  TelegramBot,
  User,
  Variable,
} from './types';

const rootURL: string = '/api/telegram-bots/';

export class StatsAPI {
  static url: string = rootURL + 'stats/';

  static async get() {
    return makeRequest<APIResponse.StatsAPI.Get>(this.url, 'GET');
  }
}

export class TelegramBotsAPI {
  static url: string = rootURL;

  static async get() {
    return makeRequest<APIResponse.TelegramBotsAPI.Get>(
      this.url,
      'GET',
      undefined,
      true,
    );
  }
  static async create(data: Data.TelegramBotsAPI.Create) {
    return makeRequest<APIResponse.TelegramBotsAPI.Create>(
      this.url,
      'POST',
      data,
      true,
    );
  }
}

export class TelegramBotAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return rootURL + `${telegramBotID}/`;
  }

  static async start(telegramBotID: TelegramBot['id']) {
    return makeRequest(this.url(telegramBotID) + 'start/', 'POST', undefined, true);
  }
  static async restart(telegramBotID: TelegramBot['id']) {
    return makeRequest(this.url(telegramBotID) + 'restart/', 'POST', undefined, true);
  }
  static async stop(telegramBotID: TelegramBot['id']) {
    return makeRequest(this.url(telegramBotID) + 'stop/', 'POST', undefined, true);
  }

  static async get(telegramBotID: TelegramBot['id']) {
    return makeRequest<APIResponse.TelegramBotAPI.Get>(
      this.url(telegramBotID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    data: Data.TelegramBotAPI.Update,
  ) {
    return makeRequest<APIResponse.TelegramBotAPI.Update>(
      this.url(telegramBotID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    data: Data.TelegramBotAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.TelegramBotAPI.PartialUpdate>(
      this.url(telegramBotID),
      'PATCH',
      data,
      true,
    );
  }
  static async delete(telegramBotID: TelegramBot['id']) {
    return makeRequest(this.url(telegramBotID), 'DELETE', undefined, true);
  }
}

export class ConnectionsAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'connections/';
  }

  static async create(
    telegramBotID: TelegramBot['id'],
    data: Data.ConnectionsAPI.Create,
  ) {
    return makeRequest<APIResponse.ConnectionsAPI.Create>(
      this.url(telegramBotID),
      'POST',
      data,
      true,
    );
  }
}

export class ConnectionAPI {
  static url(telegramBotID: TelegramBot['id'], connectionID: Connection['id']): string {
    return ConnectionsAPI.url(telegramBotID) + `${connectionID}/`;
  }

  static async delete(
    telegramBotID: TelegramBot['id'],
    connectionID: Connection['id'],
  ) {
    return makeRequest(
      this.url(telegramBotID, connectionID),
      'DELETE',
      undefined,
      true,
    );
  }
}

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

export class UsersAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'users/';
  }

  static async get<Limit extends number | undefined>(
    telegramBotID: TelegramBot['id'],
    limit: Limit,
    offset?: number,
    search?: string,
    filter?: 'is_allowed' | 'is_blocked',
  ) {
    let url: string = this.url(telegramBotID);

    if (limit || offset || search) {
      const params = new URLSearchParams();
      limit && params.set('limit', limit.toString());
      offset && params.set('offset', offset.toString());
      search && params.set('search', search);
      filter && params.set(filter, 'True');

      url += `?${params.toString()}`;
    }

    return makeRequest<
      Limit extends number
        ? APIResponse.UsersAPI.Get.Pagination
        : APIResponse.UsersAPI.Get.Default
    >(url, 'GET', undefined, true);
  }
}

export class UserAPI {
  static url(telegramBotID: TelegramBot['id'], userID: User['id']): string {
    return `${UsersAPI.url(telegramBotID)}${userID}/`;
  }

  static async get(telegramBotID: TelegramBot['id'], userID: User['id']) {
    return makeRequest<APIResponse.UserAPI.Get>(
      this.url(telegramBotID, userID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    userID: User['id'],
    data: Data.UserAPI.Update,
  ) {
    return makeRequest<APIResponse.UserAPI.Update>(
      this.url(telegramBotID, userID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    userID: User['id'],
    data: Data.UserAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.UserAPI.PartialUpdate>(
      this.url(telegramBotID, userID),
      'PATCH',
      data,
      true,
    );
  }
  static async delete(telegramBotID: TelegramBot['id'], userID: User['id']) {
    return makeRequest(this.url(telegramBotID, userID), 'DELETE', undefined, true);
  }
}

export class DatabaseRecordsAPI {
  static url(telegramBotID: TelegramBot['id']): string {
    return TelegramBotAPI.url(telegramBotID) + 'database-records/';
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
        ? APIResponse.DatabaseRecordsAPI.Get.Pagination
        : APIResponse.DatabaseRecordsAPI.Get.Default
    >(url, 'GET', undefined, true);
  }
  static async create(
    telegramBotID: TelegramBot['id'],
    data: Data.DatabaseRecordsAPI.Create,
  ) {
    return makeRequest<APIResponse.DatabaseRecordsAPI.Create>(
      this.url(telegramBotID),
      'POST',
      data,
      true,
    );
  }
}

export class DatabaseRecordAPI {
  static url(
    telegramBotID: TelegramBot['id'],
    databaseRecordID: DatabaseRecord['id'],
  ): string {
    return `${DatabaseRecordsAPI.url(telegramBotID)}${databaseRecordID}/`;
  }

  static async get(
    telegramBotID: TelegramBot['id'],
    databaseRecordID: DatabaseRecord['id'],
  ) {
    return makeRequest<APIResponse.DatabaseRecordAPI.Get>(
      this.url(telegramBotID, databaseRecordID),
      'GET',
      undefined,
      true,
    );
  }
  static async update(
    telegramBotID: TelegramBot['id'],
    databaseRecordID: DatabaseRecord['id'],
    data: Data.DatabaseRecordAPI.Update,
  ) {
    return makeRequest<APIResponse.DatabaseRecordAPI.Update>(
      this.url(telegramBotID, databaseRecordID),
      'PUT',
      data,
      true,
    );
  }
  static async partialUpdate(
    telegramBotID: TelegramBot['id'],
    databaseRecordID: DatabaseRecord['id'],
    data: Data.DatabaseRecordAPI.PartialUpdate,
  ) {
    return makeRequest<APIResponse.DatabaseRecordAPI.PartialUpdate>(
      this.url(telegramBotID, databaseRecordID),
      'PATCH',
      data,
      true,
    );
  }
  static async delete(
    telegramBotID: TelegramBot['id'],
    databaseRecordID: DatabaseRecord['id'],
  ) {
    return makeRequest(
      this.url(telegramBotID, databaseRecordID),
      'DELETE',
      undefined,
      true,
    );
  }
}
