import { makeRequest } from 'services/api/base';

import {
	TelegramBot,
	Connection,
	Command,
	Condition,
	BackgroundTask,
	Variable,
	User,
	DatabaseRecord,
	Data,
	APIResponse,
} from './types';

const rootURL: string = '/api/telegram-bots/';

export namespace StatsAPI {
	export const url: string = rootURL + 'stats/';

	export async function get() {
		return await makeRequest<APIResponse.StatsAPI.Get>(url, 'GET');
	}
}

export namespace TelegramBotsAPI {
	export const url: string = rootURL;

	export async function get() {
		return await makeRequest<APIResponse.TelegramBotsAPI.Get>(url, 'GET');
	}

	export async function create(data: Data.TelegramBotsAPI.Create) {
		return await makeRequest<APIResponse.TelegramBotsAPI.Create>(url, 'POST', data);
	}
}

export namespace TelegramBotAPI {
	export const url = (telegramBotID: TelegramBot['id']): string =>
		rootURL + `${telegramBotID}/`;

	export async function get(telegramBotID: TelegramBot['id']) {
		return await makeRequest<APIResponse.TelegramBotAPI.Get>(
			url(telegramBotID),
			'GET',
		);
	}

	export async function update(
		telegramBotID: TelegramBot['id'],
		data: Data.TelegramBotAPI.Update,
	) {
		return await makeRequest<APIResponse.TelegramBotAPI.Update>(
			url(telegramBotID),
			'PUT',
			data,
		);
	}

	export async function partialUpdate(
		telegramBotID: TelegramBot['id'],
		data: Data.TelegramBotAPI.PartialUpdate,
	) {
		return await makeRequest<APIResponse.TelegramBotAPI.PartialUpdate>(
			url(telegramBotID),
			'PATCH',
			data,
		);
	}

	export async function _delete(telegramBotID: TelegramBot['id']) {
		return await makeRequest(url(telegramBotID), 'DELETE');
	}

	export async function start(telegramBotID: TelegramBot['id']) {
		return await makeRequest(url(telegramBotID) + 'start/', 'POST');
	}

	export async function restart(telegramBotID: TelegramBot['id']) {
		return await makeRequest(url(telegramBotID) + 'restart/', 'POST');
	}

	export async function stop(telegramBotID: TelegramBot['id']) {
		return await makeRequest(url(telegramBotID) + 'stop/', 'POST');
	}
}

export namespace ConnectionsAPI {
	export const url = (telegramBotID: TelegramBot['id']): string =>
		TelegramBotAPI.url(telegramBotID) + 'connections/';

	export async function create(
		telegramBotID: TelegramBot['id'],
		data: Data.ConnectionsAPI.Create,
	) {
		return await makeRequest<APIResponse.ConnectionsAPI.Create>(
			url(telegramBotID),
			'POST',
			data,
		);
	}
}

export namespace ConnectionAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		connectionID: Connection['id'],
	): string => ConnectionsAPI.url(telegramBotID) + `${connectionID}/`;

	export async function _delete(
		telegramBotID: TelegramBot['id'],
		connectionID: Connection['id'],
	) {
		return await makeRequest(url(telegramBotID, connectionID), 'DELETE');
	}
}

export namespace CommandsAPI {
	export const url = (telegramBotID: TelegramBot['id']): string =>
		TelegramBotAPI.url(telegramBotID) + 'commands/';

	export async function get(telegramBotID: TelegramBot['id']) {
		return await makeRequest<APIResponse.CommandsAPI.Get>(
			url(telegramBotID),
			'GET',
		);
	}

	function parseMedia(
		index: number,
		formData: FormData,
		mediaType: 'image' | 'file',
		file: File | null | undefined,
		{ from_url, ...extraData }: Data.CommandsAPI.CreateCommandMedia,
	): void {
		const name: string = `${mediaType}:${index}`;

		if (file) {
			formData.append(name, file, file.name);
		} else if (from_url) {
			formData.append(name, from_url);
		}

		formData.append(`${name}:extra_data`, JSON.stringify(extraData));
	}

	export async function create(
		telegramBotID: TelegramBot['id'],
		{ images, files, ...data }: Data.CommandsAPI.Create,
	) {
		const formData = new FormData();
		images?.forEach(({ image, ...media }, index) =>
			parseMedia(index, formData, 'image', image, media),
		);
		files?.forEach(({ file, ...media }, index) =>
			parseMedia(index, formData, 'file', file, media),
		);
		formData.append('data', JSON.stringify(data));

		return await makeRequest<APIResponse.CommandsAPI.Create>(
			url(telegramBotID),
			'POST',
			formData,
		);
	}
}

export namespace CommandAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
	): string => CommandsAPI.url(telegramBotID) + `${commandID}/`;

	export async function get(
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
	) {
		return await makeRequest<APIResponse.CommandAPI.Get>(
			url(telegramBotID, commandID),
			'GET',
		);
	}

	function parseMedia(
		index: number,
		formData: FormData,
		mediaType: 'image' | 'file',
		file: File | null | undefined,
		{ id, from_url, ...extraData }: Partial<Data.CommandAPI.UpdateCommandMedia>,
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

	export async function update(
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
		{ images, files, ...data }: Data.CommandAPI.Update,
	) {
		const formData = new FormData();
		images?.forEach(({ image, ...media }, index) =>
			parseMedia(index, formData, 'image', image, media),
		);
		files?.forEach(({ file, ...media }, index) =>
			parseMedia(index, formData, 'file', file, media),
		);
		formData.append('data', JSON.stringify(data));

		return await makeRequest<APIResponse.CommandAPI.Update>(
			url(telegramBotID, commandID),
			'PUT',
			formData,
		);
	}

	export async function partialUpdate(
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
		{ images, files, ...data }: Data.CommandAPI.PartialUpdate,
	) {
		const formData = new FormData();
		images?.forEach(({ image, ...media }, index) =>
			parseMedia(index, formData, 'image', image, media),
		);
		files?.forEach(({ file, ...media }, index) =>
			parseMedia(index, formData, 'file', file, media),
		);
		formData.append('data', JSON.stringify(data));

		return await makeRequest<APIResponse.CommandAPI.PartialUpdate>(
			url(telegramBotID, commandID),
			'PATCH',
			formData,
		);
	}

	export async function _delete(
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
	) {
		return await makeRequest(url(telegramBotID, commandID), 'DELETE');
	}
}

export namespace ConditionsAPI {
	export const url = (telegramBotID: TelegramBot['id']): string =>
		TelegramBotAPI.url(telegramBotID) + 'conditions/';

	export async function get(telegramBotID: TelegramBot['id']) {
		return await makeRequest<APIResponse.ConditionsAPI.Get>(
			url(telegramBotID),
			'GET',
		);
	}

	export async function create(
		telegramBotID: TelegramBot['id'],
		data: Data.ConditionsAPI.Create,
	) {
		return await makeRequest<APIResponse.ConditionsAPI.Create>(
			url(telegramBotID),
			'POST',
			data,
		);
	}
}

export namespace ConditionAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		conditionID: Condition['id'],
	): string => ConditionsAPI.url(telegramBotID) + `${conditionID}/`;

	export async function get(
		telegramBotID: TelegramBot['id'],
		conditionID: Condition['id'],
	) {
		return await makeRequest<APIResponse.ConditionAPI.Get>(
			url(telegramBotID, conditionID),
			'GET',
		);
	}

	export async function update(
		telegramBotID: TelegramBot['id'],
		conditionID: Condition['id'],
		data: Data.ConditionAPI.Update,
	) {
		return await makeRequest<APIResponse.ConditionAPI.Update>(
			url(telegramBotID, conditionID),
			'PUT',
			data,
		);
	}

	export async function partialUpdate(
		telegramBotID: TelegramBot['id'],
		conditionID: Condition['id'],
		data: Data.ConditionAPI.PartialUpdate,
	) {
		return await makeRequest<APIResponse.ConditionAPI.PartialUpdate>(
			url(telegramBotID, conditionID),
			'PATCH',
			data,
		);
	}

	export async function _delete(
		telegramBotID: TelegramBot['id'],
		conditionID: Condition['id'],
	) {
		return await makeRequest(url(telegramBotID, conditionID), 'DELETE');
	}
}

export namespace BackgroundTasksAPI {
	export const url = (telegramBotID: TelegramBot['id']): string =>
		TelegramBotAPI.url(telegramBotID) + 'background-tasks/';

	export async function get(telegramBotID: TelegramBot['id']) {
		return await makeRequest<APIResponse.BackgroundTasksAPI.Get>(
			url(telegramBotID),
			'GET',
		);
	}

	export async function create(
		telegramBotID: TelegramBot['id'],
		data: Data.BackgroundTasksAPI.Create,
	) {
		return await makeRequest<APIResponse.BackgroundTasksAPI.Create>(
			url(telegramBotID),
			'POST',
			data,
		);
	}
}

export namespace BackgroundTaskAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		backgroundTaskID: BackgroundTask['id'],
	): string => BackgroundTasksAPI.url(telegramBotID) + `${backgroundTaskID}/`;

	export async function get(
		telegramBotID: TelegramBot['id'],
		backgroundTaskID: BackgroundTask['id'],
	) {
		return await makeRequest<APIResponse.BackgroundTaskAPI.Get>(
			url(telegramBotID, backgroundTaskID),
			'GET',
		);
	}

	export async function update(
		telegramBotID: TelegramBot['id'],
		backgroundTaskID: BackgroundTask['id'],
		data: Data.BackgroundTaskAPI.Update,
	) {
		return await makeRequest<APIResponse.BackgroundTaskAPI.Update>(
			url(telegramBotID, backgroundTaskID),
			'PUT',
			data,
		);
	}

	export async function partialUpdate(
		telegramBotID: TelegramBot['id'],
		backgroundTaskID: BackgroundTask['id'],
		data: Data.BackgroundTaskAPI.PartialUpdate,
	) {
		return await makeRequest<APIResponse.BackgroundTaskAPI.PartialUpdate>(
			url(telegramBotID, backgroundTaskID),
			'PATCH',
			data,
		);
	}

	export async function _delete(
		telegramBotID: TelegramBot['id'],
		backgroundTaskID: BackgroundTask['id'],
	) {
		return await makeRequest(url(telegramBotID, backgroundTaskID), 'DELETE');
	}
}

export namespace DiagramCommandsAPI {
	export const url = (telegramBotID: TelegramBot['id']): string =>
		TelegramBotAPI.url(telegramBotID) + 'diagram/commands/';

	export async function get(telegramBotID: TelegramBot['id']) {
		return await makeRequest<APIResponse.DiagramCommandsAPI.Get>(
			url(telegramBotID),
			'GET',
		);
	}
}

export namespace DiagramCommandAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
	): string => DiagramCommandsAPI.url(telegramBotID) + commandID + '/';

	export async function get(
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
	) {
		return await makeRequest<APIResponse.DiagramCommandAPI.Get>(
			url(telegramBotID, commandID),
			'GET',
		);
	}

	export async function update(
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
		data: Data.DiagramCommandAPI.Update,
	) {
		return await makeRequest<APIResponse.DiagramCommandAPI.Update>(
			url(telegramBotID, commandID),
			'PUT',
			data,
		);
	}

	export async function partialUpdate(
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
		data: Data.DiagramCommandAPI.PartialUpdate,
	) {
		return await makeRequest<APIResponse.DiagramCommandAPI.PartialUpdate>(
			url(telegramBotID, commandID),
			'PATCH',
			data,
		);
	}
}

export namespace DiagramConditionsAPI {
	export const url = (telegramBotID: TelegramBot['id']): string =>
		TelegramBotAPI.url(telegramBotID) + 'diagram/conditions/';

	export async function get(telegramBotID: TelegramBot['id']) {
		return await makeRequest<APIResponse.DiagramConditionsAPI.Get>(
			url(telegramBotID),
			'GET',
		);
	}
}

export namespace DiagramConditionAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		conditionID: Condition['id'],
	): string => DiagramConditionsAPI.url(telegramBotID) + conditionID + '/';

	export async function get(
		telegramBotID: TelegramBot['id'],
		conditionID: Condition['id'],
	) {
		return await makeRequest<APIResponse.DiagramConditionAPI.Get>(
			url(telegramBotID, conditionID),
			'GET',
		);
	}

	export async function update(
		telegramBotID: TelegramBot['id'],
		conditionID: Condition['id'],
		data: Data.DiagramConditionAPI.Update,
	) {
		return await makeRequest<APIResponse.DiagramConditionAPI.Update>(
			url(telegramBotID, conditionID),
			'PUT',
			data,
		);
	}

	export async function partialUpdate(
		telegramBotID: TelegramBot['id'],
		conditionID: Condition['id'],
		data: Data.DiagramConditionAPI.PartialUpdate,
	) {
		return await makeRequest<APIResponse.DiagramConditionAPI.PartialUpdate>(
			url(telegramBotID, conditionID),
			'PATCH',
			data,
		);
	}
}

export namespace DiagramBackgroundTasksAPI {
	export const url = (telegramBotID: TelegramBot['id']): string =>
		TelegramBotAPI.url(telegramBotID) + 'diagram/background-tasks/';

	export async function get(telegramBotID: TelegramBot['id']) {
		return await makeRequest<APIResponse.DiagramBackgroundTasksAPI.Get>(
			url(telegramBotID),
			'GET',
		);
	}
}

export namespace DiagramBackgroundTaskAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		backgroundTaskID: BackgroundTask['id'],
	): string => DiagramBackgroundTasksAPI.url(telegramBotID) + backgroundTaskID + '/';

	export async function get(
		telegramBotID: TelegramBot['id'],
		backgroundTaskID: BackgroundTask['id'],
	) {
		return await makeRequest<APIResponse.DiagramBackgroundTaskAPI.Get>(
			url(telegramBotID, backgroundTaskID),
			'GET',
		);
	}

	export async function update(
		telegramBotID: TelegramBot['id'],
		backgroundTaskID: BackgroundTask['id'],
		data: Data.DiagramBackgroundTaskAPI.Update,
	) {
		return await makeRequest<APIResponse.DiagramBackgroundTaskAPI.Update>(
			url(telegramBotID, backgroundTaskID),
			'PUT',
			data,
		);
	}

	export async function partialUpdate(
		telegramBotID: TelegramBot['id'],
		backgroundTaskID: BackgroundTask['id'],
		data: Data.DiagramBackgroundTaskAPI.PartialUpdate,
	) {
		return await makeRequest<APIResponse.DiagramBackgroundTaskAPI.PartialUpdate>(
			url(telegramBotID, backgroundTaskID),
			'PATCH',
			data,
		);
	}
}

export namespace VariablesAPI {
	export const url = (telegramBotID: TelegramBot['id']): string =>
		TelegramBotAPI.url(telegramBotID) + 'variables/';

	export async function get<Limit extends number | undefined>(
		telegramBotID: TelegramBot['id'],
		limit: Limit,
		offset?: number,
		search?: string,
	) {
		let url: string = VariablesAPI.url(telegramBotID);

		if (limit || offset || search) {
			const params = new URLSearchParams();
			limit && params.set('limit', limit.toString());
			offset && params.set('offset', offset.toString());
			search && params.set('search', search);

			url += `?${params.toString()}`;
		}

		return await makeRequest<
			Limit extends number
				? APIResponse.VariablesAPI.Get.Pagination
				: APIResponse.VariablesAPI.Get.Default
		>(url, 'GET');
	}

	export async function create(
		telegramBotID: TelegramBot['id'],
		data: Data.VariablesAPI.Create,
	) {
		return await makeRequest<APIResponse.VariablesAPI.Create>(
			VariablesAPI.url(telegramBotID),
			'POST',
			data,
		);
	}
}

export namespace VariableAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		variableID: Variable['id'],
	): string => VariablesAPI.url(telegramBotID) + `${variableID}/`;

	export async function get(
		telegramBotID: TelegramBot['id'],
		variableID: Variable['id'],
	) {
		return await makeRequest<APIResponse.VariableAPI.Get>(
			url(telegramBotID, variableID),
			'GET',
		);
	}

	export async function update(
		telegramBotID: TelegramBot['id'],
		variableID: Variable['id'],
		data: Data.VariableAPI.Update,
	) {
		return await makeRequest<APIResponse.VariableAPI.Update>(
			url(telegramBotID, variableID),
			'PUT',
			data,
		);
	}

	export async function partialUpdate(
		telegramBotID: TelegramBot['id'],
		variableID: Variable['id'],
		data: Data.VariableAPI.PartialUpdate,
	) {
		return await makeRequest<APIResponse.VariableAPI.PartialUpdate>(
			url(telegramBotID, variableID),
			'PATCH',
			data,
		);
	}

	export async function _delete(
		telegramBotID: TelegramBot['id'],
		variableID: Variable['id'],
	) {
		return await makeRequest(url(telegramBotID, variableID), 'DELETE');
	}
}

export namespace UsersAPI {
	export const url = (telegramBotID: TelegramBot['id']): string =>
		TelegramBotAPI.url(telegramBotID) + 'users/';

	export async function get<Limit extends number | undefined>(
		telegramBotID: TelegramBot['id'],
		limit: Limit,
		offset?: number,
		search?: string,
		filter?: 'is_allowed' | 'is_blocked',
	) {
		let url: string = UsersAPI.url(telegramBotID);

		if (limit || offset || search) {
			const params = new URLSearchParams();
			limit && params.set('limit', limit.toString());
			offset && params.set('offset', offset.toString());
			search && params.set('search', search);
			filter && params.set(filter, 'True');

			url += `?${params.toString()}`;
		}

		return await makeRequest<
			Limit extends number
				? APIResponse.UsersAPI.Get.Pagination
				: APIResponse.UsersAPI.Get.Default
		>(url, 'GET');
	}
}

export namespace UserAPI {
	export const url = (telegramBotID: TelegramBot['id'], userID: User['id']): string =>
		`${UsersAPI.url(telegramBotID)}${userID}/`;

	export async function get(telegramBotID: TelegramBot['id'], userID: User['id']) {
		return await makeRequest<APIResponse.UserAPI.Get>(
			url(telegramBotID, userID),
			'GET',
		);
	}

	export async function update(
		telegramBotID: TelegramBot['id'],
		userID: User['id'],
		data: Data.UserAPI.Update,
	) {
		return await makeRequest<APIResponse.UserAPI.Update>(
			url(telegramBotID, userID),
			'PUT',
			data,
		);
	}

	export async function partialUpdate(
		telegramBotID: TelegramBot['id'],
		userID: User['id'],
		data: Data.UserAPI.PartialUpdate,
	) {
		return await makeRequest<APIResponse.UserAPI.PartialUpdate>(
			url(telegramBotID, userID),
			'PATCH',
			data,
		);
	}

	export async function _delete(
		telegramBotID: TelegramBot['id'],
		userID: User['id'],
	) {
		return await makeRequest(url(telegramBotID, userID), 'DELETE');
	}
}

export namespace DatabaseRecordsAPI {
	export const url = (telegramBotID: TelegramBot['id']): string =>
		TelegramBotAPI.url(telegramBotID) + 'database-records/';

	export async function get<Limit extends number | undefined>(
		telegramBotID: TelegramBot['id'],
		limit: Limit,
		offset?: number,
		search?: string,
	) {
		let url: string = DatabaseRecordsAPI.url(telegramBotID);

		if (limit || offset || search) {
			const params = new URLSearchParams();
			limit && params.set('limit', limit.toString());
			offset && params.set('offset', offset.toString());
			search && params.set('search', search);

			url += `?${params.toString()}`;
		}

		return await makeRequest<
			Limit extends number
				? APIResponse.DatabaseRecordsAPI.Get.Pagination
				: APIResponse.DatabaseRecordsAPI.Get.Default
		>(url, 'GET');
	}

	export async function create(
		telegramBotID: TelegramBot['id'],
		data: Data.DatabaseRecordsAPI.Create,
	) {
		return await makeRequest<APIResponse.DatabaseRecordsAPI.Create>(
			DatabaseRecordsAPI.url(telegramBotID),
			'POST',
			data,
		);
	}
}

export namespace DatabaseRecordAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		databaseRecordID: DatabaseRecord['id'],
	): string => `${DatabaseRecordsAPI.url(telegramBotID)}${databaseRecordID}/`;

	export async function get(
		telegramBotID: TelegramBot['id'],
		databaseRecordID: DatabaseRecord['id'],
	) {
		return await makeRequest<APIResponse.DatabaseRecordAPI.Get>(
			url(telegramBotID, databaseRecordID),
			'GET',
		);
	}

	export async function update(
		telegramBotID: TelegramBot['id'],
		databaseRecordID: DatabaseRecord['id'],
		data: Data.DatabaseRecordAPI.Update,
	) {
		return await makeRequest<APIResponse.DatabaseRecordAPI.Update>(
			url(telegramBotID, databaseRecordID),
			'PUT',
			data,
		);
	}

	export async function partialUpdate(
		telegramBotID: TelegramBot['id'],
		databaseRecordID: DatabaseRecord['id'],
		data: Data.DatabaseRecordAPI.PartialUpdate,
	) {
		return await makeRequest<APIResponse.DatabaseRecordAPI.PartialUpdate>(
			url(telegramBotID, databaseRecordID),
			'PATCH',
			data,
		);
	}

	export async function _delete(
		telegramBotID: TelegramBot['id'],
		databaseRecordID: DatabaseRecord['id'],
	) {
		return await makeRequest(url(telegramBotID, databaseRecordID), 'DELETE');
	}
}
