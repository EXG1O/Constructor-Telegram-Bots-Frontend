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

const rootURL = '/api/telegram-bots/';

export namespace StatsAPI {
	export const url = rootURL + 'stats/';

	export const get = () => makeRequest<APIResponse.StatsAPI.Get>(url, 'GET');
}

export namespace TelegramBotsAPI {
	export const get = () => makeRequest<APIResponse.TelegramBotsAPI.Get>(rootURL, 'GET');
	export const create = (data: Data.TelegramBotsAPI.Create) => (
		makeRequest<APIResponse.TelegramBotsAPI.Create>(rootURL, 'POST', data)
	);
}

export namespace TelegramBotAPI {
	export const url = (telegramBotID: TelegramBot['id']) => rootURL + `${telegramBotID}/`;

	export const get = (telegramBotID: TelegramBot['id']) => (
		makeRequest<APIResponse.TelegramBotAPI.Get>(url(telegramBotID), 'GET')
	);
	export const update = (
		telegramBotID: TelegramBot['id'],
		data: Data.TelegramBotAPI.Update,
	) => makeRequest<APIResponse.TelegramBotAPI.Update>(url(telegramBotID), 'PUT', data);
	export const partialUpdate = (
		telegramBotID: TelegramBot['id'],
		data: Data.TelegramBotAPI.PartialUpdate,
	) => makeRequest<APIResponse.TelegramBotAPI.PartialUpdate>(url(telegramBotID), 'PATCH', data);
	export const _delete = (telegramBotID: TelegramBot['id']) => makeRequest(url(telegramBotID), 'DELETE');

	export const start = (telegramBotID: TelegramBot['id']) => (
		makeRequest(url(telegramBotID), 'POST', { action: 'start' })
	);
	export const restart = (telegramBotID: TelegramBot['id']) => (
		makeRequest(url(telegramBotID), 'POST', { action: 'restart' })
	);
	export const stop = (telegramBotID: TelegramBot['id']) => (
		makeRequest(url(telegramBotID), 'POST', { action: 'stop' })
	);
}

export namespace ConnectionsAPI {
	export const url = (telegramBotID: TelegramBot['id']) => TelegramBotAPI.url(telegramBotID) + 'connections/';

	export const create = (
		telegramBotID: TelegramBot['id'],
		data: Data.ConnectionsAPI.Create,
	) => makeRequest<APIResponse.ConnectionsAPI.Create>(url(telegramBotID), 'POST', data);
}

export namespace ConnectionAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		connectionID: Connection['id'],
	) => ConnectionsAPI.url(telegramBotID) + `${connectionID}/`;

	export const _delete = (
		telegramBotID: TelegramBot['id'],
		connectionID: Connection['id'],
	) => makeRequest(url(telegramBotID, connectionID), 'DELETE');
}

export namespace CommandsAPI {
	export const url = (telegramBotID: TelegramBot['id']) => TelegramBotAPI.url(telegramBotID) + 'commands/';

	export const get = (telegramBotID: TelegramBot['id']) => (
		makeRequest<APIResponse.CommandsAPI.Get>(url(telegramBotID), 'GET')
	);
	export const create = (
		telegramBotID: TelegramBot['id'],
		{ images, files, ...data }: Data.CommandsAPI.Create,
	) => {
		const formData = new FormData();
		images?.forEach((image, index) => formData.append(`image:${index}`, image, image.name));
		files?.forEach((file, index) => formData.append(`file:${index}`, file, file.name));
		formData.append('data', JSON.stringify(data));

		return makeRequest<APIResponse.CommandsAPI.Create>(url(telegramBotID), 'POST', formData);
	}
}

export namespace CommandAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
	) => CommandsAPI.url(telegramBotID) + `${commandID}/`;

	export const get = (
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
	) => makeRequest<APIResponse.CommandAPI.Get>(url(telegramBotID, commandID), 'GET');
	export const update = (
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
		{ images, files, ...data }: Data.CommandAPI.Update,
	) => {
		const formData = new FormData();
		images?.forEach((image, index) => {
			const name = `image:${index}`;

			if (typeof image === 'number') {
				formData.append(name, image.toString());
			} else {
				formData.append(name, image, image.name);
			}
		});
		files?.forEach((file, index) => {
			const name = `file:${index}`;

			if (typeof file === 'number') {
				formData.append(name, file.toString());
			} else {
				formData.append(name, file, file.name);
			}
		});
		formData.append('data', JSON.stringify(data));

		return makeRequest<APIResponse.CommandAPI.Update>(url(telegramBotID, commandID), 'PUT', formData);
	};
	export const _delete = (
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
	) => makeRequest(url(telegramBotID, commandID), 'DELETE');
}

export namespace ConditionsAPI {
	export const url = (telegramBotID: TelegramBot['id']) => TelegramBotAPI.url(telegramBotID) + 'conditions/';

	export const get = (telegramBotID: TelegramBot['id']) => (
		makeRequest<APIResponse.ConditionsAPI.Get>(url(telegramBotID), 'GET')
	);
	export const create = (
		telegramBotID: TelegramBot['id'],
		data: Data.ConditionsAPI.Create,
	) => makeRequest<APIResponse.ConditionsAPI.Create>(url(telegramBotID), 'POST', data);
}

export namespace ConditionAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		conditionID: Condition['id'],
	) => ConditionsAPI.url(telegramBotID) + `${conditionID}/`;

	export const get = (
		telegramBotID: TelegramBot['id'],
		conditionID: Condition['id'],
	) => makeRequest<APIResponse.ConditionAPI.Get>(url(telegramBotID, conditionID), 'GET');
	export const update = (
		telegramBotID: TelegramBot['id'],
		conditionID: Condition['id'],
		data: Data.ConditionAPI.Update,
	) => makeRequest<APIResponse.ConditionAPI.Update>(url(telegramBotID, conditionID), 'PUT', data);
	export const _delete = (
		telegramBotID: TelegramBot['id'],
		conditionID: Condition['id'],
	) => makeRequest(url(telegramBotID, conditionID), 'DELETE');
}

export namespace BackgroundTasksAPI {
	export const url = (telegramBotID: TelegramBot['id']) => TelegramBotAPI.url(telegramBotID) + 'background-tasks/';

	export const get = (telegramBotID: TelegramBot['id']) => (
		makeRequest<APIResponse.BackgroundTasksAPI.Get>(url(telegramBotID), 'GET')
	);
	export const create = (
		telegramBotID: TelegramBot['id'],
		data: Data.BackgroundTasksAPI.Create,
	) => makeRequest<APIResponse.BackgroundTasksAPI.Create>(url(telegramBotID), 'POST', data);
}

export namespace BackgroundTaskAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		backgroundTaskID: BackgroundTask['id'],
	) => BackgroundTasksAPI.url(telegramBotID) + `${backgroundTaskID}/`;

	export const get = (
		telegramBotID: TelegramBot['id'],
		backgroundTaskID: BackgroundTask['id'],
	) => makeRequest<APIResponse.BackgroundTaskAPI.Get>(url(telegramBotID, backgroundTaskID), 'GET');
	export const update = (
		telegramBotID: TelegramBot['id'],
		backgroundTaskID: BackgroundTask['id'],
		data: Data.BackgroundTaskAPI.Update,
	) => makeRequest<APIResponse.BackgroundTaskAPI.Update>(url(telegramBotID, backgroundTaskID), 'PUT', data);
	export const _delete = (
		telegramBotID: TelegramBot['id'],
		backgroundTaskID: BackgroundTask['id'],
	) => makeRequest(url(telegramBotID, backgroundTaskID), 'DELETE');
}

export namespace DiagramCommandsAPI {
	export const url = (telegramBotID: TelegramBot['id']) => TelegramBotAPI.url(telegramBotID) + 'diagram/commands/';

	export const get = (telegramBotID: TelegramBot['id']) => (
		makeRequest<APIResponse.DiagramCommandsAPI.Get>(url(telegramBotID), 'GET')
	);
}

export namespace DiagramCommandAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
	) => DiagramCommandsAPI.url(telegramBotID) + commandID + '/';

	export const get = (
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
	) => makeRequest<APIResponse.DiagramCommandAPI.Get>(url(telegramBotID, commandID), 'GET');
	export const update = (
		telegramBotID: TelegramBot['id'],
		commandID: Command['id'],
		data: Data.DiagramCommandAPI.Update,
	) => makeRequest(url(telegramBotID, commandID), 'PATCH', data);
}

export namespace DiagramConditionsAPI {
	export const url = (telegramBotID: TelegramBot['id']) => TelegramBotAPI.url(telegramBotID) + 'diagram/conditions/';

	export const get = (telegramBotID: TelegramBot['id']) => (
		makeRequest<APIResponse.DiagramConditionsAPI.Get>(url(telegramBotID), 'GET')
	);
}

export namespace DiagramConditionAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		conditionID: Condition['id'],
	) => DiagramConditionsAPI.url(telegramBotID) + conditionID + '/';

	export const update = (
		telegramBotID: TelegramBot['id'],
		conditionID: Condition['id'],
		data: Data.DiagramConditionAPI.Update,
	) => makeRequest(url(telegramBotID, conditionID), 'PATCH', data);
}

export namespace DiagramBackgroundTasksAPI {
	export const url = (telegramBotID: TelegramBot['id']) => TelegramBotAPI.url(telegramBotID) + 'diagram/background-tasks/';

	export const get = (telegramBotID: TelegramBot['id']) => (
		makeRequest<APIResponse.DiagramBackgroundTasksAPI.Get>(url(telegramBotID), 'GET')
	);
}

export namespace DiagramBackgroundTaskAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		backgroundTaskID: BackgroundTask['id'],
	) => DiagramBackgroundTasksAPI.url(telegramBotID) + backgroundTaskID + '/';

	export const update = (
		telegramBotID: TelegramBot['id'],
		backgroundTaskID: BackgroundTask['id'],
		data: Data.DiagramBackgroundTaskAPI.Update,
	) => makeRequest(url(telegramBotID, backgroundTaskID), 'PATCH', data);
}

export namespace VariablesAPI {
	export const url = (telegramBotID: TelegramBot['id']) => TelegramBotAPI.url(telegramBotID) + 'variables/';

	export const get = <Limit extends number | undefined>(
		telegramBotID: TelegramBot['id'],
		limit: Limit,
		offset?: number,
		search?: string,
	) => {
		let url: string = VariablesAPI.url(telegramBotID);

		if (limit || offset || search) {
			const params = new URLSearchParams();
			limit && params.set('limit', limit.toString());
			offset && params.set('offset', offset.toString());
			search && params.set('search', search);

			url += `?${params.toString()}`;
		}

		return makeRequest<
			Limit extends number ?
			APIResponse.VariablesAPI.Get.Pagination :
			APIResponse.VariablesAPI.Get.Default
		>(url, 'GET');
	}
}

export namespace VariableAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		variableID: Variable['id'],
	) => VariablesAPI.url(telegramBotID) + `${variableID}/`;

	export const get = (
		telegramBotID: TelegramBot['id'],
		variableID: Variable['id'],
	) => makeRequest<APIResponse.VariableAPI.Get>(url(telegramBotID, variableID), 'GET');
	export const create = (
		telegramBotID: TelegramBot['id'],
		data: Data.VariableAPI.Create,
	) => makeRequest<APIResponse.VariableAPI.Create>(VariablesAPI.url(telegramBotID), 'POST', data);
	export const update = (
		telegramBotID: TelegramBot['id'],
		variableID: Variable['id'],
		data: Data.VariableAPI.Update,
	) => makeRequest<APIResponse.VariableAPI.Update>(url(telegramBotID, variableID), 'PUT', data);
	export const _delete = (
		telegramBotID: TelegramBot['id'],
		variableID: Variable['id'],
	) => makeRequest(url(telegramBotID, variableID), 'DELETE');
}

export namespace UsersAPI {
	export const url = (telegramBotID: TelegramBot['id']) => TelegramBotAPI.url(telegramBotID) + 'users/';

	export const get = <Limit extends number | undefined>(
		telegramBotID: TelegramBot['id'],
		limit: Limit,
		offset?: number,
		search?: string,
		filter?: 'is_allowed' | 'is_blocked',
	) => {
		let url: string = UsersAPI.url(telegramBotID);

		if (limit || offset || search) {
			const params = new URLSearchParams();
			limit && params.set('limit', limit.toString());
			offset && params.set('offset', offset.toString());
			search && params.set('search', search);
			filter && params.set(filter, 'True');

			url += `?${params.toString()}`;
		}

		return makeRequest<
			Limit extends number ?
			APIResponse.UsersAPI.Get.Pagination :
			APIResponse.UsersAPI.Get.Default
		>(url, 'GET');
	}
}

export namespace UserAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		userID: User['id'],
	) => `${UsersAPI.url(telegramBotID)}${userID}/`;

	export const get = (
		telegramBotID: TelegramBot['id'],
		userID: User['id'],
	) => makeRequest<APIResponse.UserAPI.Get>(url(telegramBotID, userID), 'GET');
	export const update = (
		telegramBotID: TelegramBot['id'],
		userID: User['id'],
		data: Data.UserAPI.Update,
	) => makeRequest<APIResponse.UserAPI.Update>(url(telegramBotID, userID), 'PATCH', data);
	export const partialUpdate = (
		telegramBotID: TelegramBot['id'],
		userID: User['id'],
		data: Data.UserAPI.PartialUpdate,
	) => makeRequest<APIResponse.UserAPI.PartialUpdate>(url(telegramBotID, userID), 'PATCH', data);
	export const _delete = (
		telegramBotID: TelegramBot['id'],
		userID: User['id'],
	) => makeRequest(url(telegramBotID, userID), 'DELETE');
}

export namespace DatabaseRecordsAPI {
	export const url = (telegramBotID: TelegramBot['id']) => TelegramBotAPI.url(telegramBotID) + 'database-records/';

	export const get = <Limit extends number | undefined>(
		telegramBotID: TelegramBot['id'],
		limit: Limit,
		offset?: number,
		search?: string,
	) => {
		let url: string = DatabaseRecordsAPI.url(telegramBotID);

		if (limit || offset || search) {
			const params = new URLSearchParams();
			limit && params.set('limit', limit.toString());
			offset && params.set('offset', offset.toString());
			search && params.set('search', search);

			url += `?${params.toString()}`;
		}

		return makeRequest<
			Limit extends number ?
			APIResponse.DatabaseRecordsAPI.Get.Pagination :
			APIResponse.DatabaseRecordsAPI.Get.Default
		>(url, 'GET');
	}
}

export namespace DatabaseRecordAPI {
	export const url = (
		telegramBotID: TelegramBot['id'],
		databaseRecordID: DatabaseRecord['id'],
	) => `${DatabaseRecordsAPI.url(telegramBotID)}${databaseRecordID}/`;

	export const get = (
		telegramBotID: TelegramBot['id'],
		databaseRecordID: DatabaseRecord['id'],
	) => makeRequest<APIResponse.DatabaseRecordAPI.Get>(url(telegramBotID, databaseRecordID), 'GET');
	export const create = (
		telegramBotID: TelegramBot['id'],
		data: Data.DatabaseRecordAPI.Create,
	) => makeRequest<APIResponse.DatabaseRecordAPI.Create>(DatabaseRecordsAPI.url(telegramBotID), 'POST', data);
	export const update = (
		telegramBotID: TelegramBot['id'],
		databaseRecordID: DatabaseRecord['id'],
		data: Data.DatabaseRecordAPI.Update,
	) => makeRequest<APIResponse.DatabaseRecordAPI.Update>(url(telegramBotID, databaseRecordID), 'PATCH', data);
	export const partialUpdate = (
		telegramBotID: TelegramBot['id'],
		databaseRecordID: DatabaseRecord['id'],
		data: Data.DatabaseRecordAPI.PartialUpdate,
	) => makeRequest<APIResponse.DatabaseRecordAPI.PartialUpdate>(url(telegramBotID, databaseRecordID), 'PATCH', data);
	export const _delete = (
		telegramBotID: TelegramBot['id'],
		databaseRecordID: DatabaseRecord['id'],
	) => makeRequest(url(telegramBotID, databaseRecordID), 'DELETE');
}