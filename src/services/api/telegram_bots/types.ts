export interface TelegramBot {
	id: number;
	username: string | null;
	api_token: string;
	storage_size: number;
	used_storage_size: number;
	remaining_storage_size: number;
	is_private: boolean;
	is_enabled: boolean;
	is_loading: boolean;
	added_date: string;
}

type HandlePositions = 'left' | 'right';

export interface Connection {
	id: number;
	source_object_type: 'command' | 'command_keyboard_button' | 'condition' | 'background_task';
	source_object_id: number;
	source_handle_position: HandlePositions;
	target_object_type: 'command' | 'condition';
	target_object_id: number;
	target_handle_position: HandlePositions;
}

export interface APIRequest {
	url: string;
	method: 'get' | 'post' | 'put' | 'patch' | 'delete';
	headers: Record<string, any> | null;
	body: Record<string, any> | null;
}

export interface CommandSettings {
	is_reply_to_user_message: boolean;
	is_delete_user_message: boolean;
	is_send_as_new_message: boolean;
}

export interface CommandTrigger {
	text: string;
	description: string | null;
}

export interface CommandImage {
	id: number;
	name: string;
	size: number;
	url: string;
}

export type CommandFile = CommandImage;

export interface CommandMessage {
	text: string;
}

export interface CommandKeyboardButton {
	id: number;
	row: number | null;
	text: string;
	url: string | null;
}

export interface CommandKeyboard {
	type: 'default' | 'inline' | 'payment';
	buttons: CommandKeyboardButton[];
}

export type CommandAPIRequest = APIRequest;

export interface CommandDatabaseRecord {
	data: Record<string, any>;
}

export interface Command {
	id: number;
	name: string;
	settings: CommandSettings;
	trigger: CommandTrigger | null;
	images: CommandImage[];
	files: CommandFile[];
	message: CommandMessage;
	keyboard: CommandKeyboard | null;
	api_request: CommandAPIRequest | null;
	database_record: CommandDatabaseRecord | null;
}

export interface ConditionPart {
	id: number;
	type: '+' | '-';
	first_value: string;
	operator: '==' | '!=' | '>' | '>=' | '<' | '<=';
	second_value: string;
	next_part_operator: '&&' | '||' | null;
}

export interface Condition {
	id: number;
	name: string;
	parts: ConditionPart[];
}

export type BackgroundTaskAPIRequest = APIRequest;

export interface BackgroundTask {
	id: number;
	name: string;
	interval: 1 | 3 | 7 | 14 | 28;
	api_request: BackgroundTaskAPIRequest | null;
}

export interface DiagramBlock {
	x: number;
	y: number;
	source_connections: Connection[];
	target_connections: Connection[];
}

export interface DiagramCommandKeyboardButton extends CommandKeyboardButton {
	source_connections: Connection[];
}

export interface DiagramCommandKeyboard extends Omit<CommandKeyboard, 'buttons'> {
	buttons: DiagramCommandKeyboardButton[];
}

export interface DiagramCommand extends Pick<Command, 'id' | 'name' | 'images' | 'files' | 'message'>, DiagramBlock {
	keyboard: DiagramCommandKeyboard | null;
}

export type DiagramCondition = Omit<Condition, 'parts'> & DiagramBlock;

export type DiagramBackgroundTask = Omit<BackgroundTask, 'api_request'> & Omit<DiagramBlock, 'source_connections'>;

export interface Variable {
	id: number;
	name: string;
	value: string;
	description: string;
}

export interface User {
	id: number;
	telegram_id: number;
	full_name: string;
	is_allowed: boolean;
	is_blocked: boolean;
	activated_date: string;
}

export interface DatabaseRecord {
	id: number;
	data: Record<string, any>;
}

export namespace Data {
	export namespace TelegramBotsAPI {
		export type Create = Pick<TelegramBot, 'api_token' | 'is_private'>;
	}

	export namespace TelegramBotAPI {
		export type Update = TelegramBotsAPI.Create;
		export type PartialUpdate = Partial<Update>;
	}

	export namespace ConnectionsAPI {
		export type Create = Omit<Connection, 'id'>;
	}

	export namespace CommandsAPI {
		interface CreateCommandKeyboard extends Omit<CommandKeyboard, 'buttons'> {
			buttons: Omit<CommandKeyboardButton, 'id'>[];
		}

		export interface Create extends Omit<Command, 'id' | 'images' | 'files' | 'keyboard'> {
			images?: File[],
			files?: File[],
			keyboard: CreateCommandKeyboard | null;
		}
	}

	export namespace CommandAPI {
		interface UpdateCommandKeyboardButton extends Omit<CommandKeyboardButton, 'id'> {
			id?: CommandKeyboardButton['id'];
		}

		interface UpdateCommandKeyboard extends Omit<CommandKeyboard, 'buttons'> {
			buttons: UpdateCommandKeyboardButton[];
		}

		export interface Update extends Omit<Command, 'id' | 'images' | 'files' | 'keyboard'> {
			images?: (File | number)[];
			files?: (File | number)[];
			keyboard: UpdateCommandKeyboard | null;
		}
	}

	export namespace ConditionsAPI {
		export interface Create extends Omit<Condition, 'id' | 'parts'> {
			parts: Omit<ConditionPart, 'id'>[];
		}
	}

	export namespace ConditionAPI {
		export type Update = Omit<Condition, 'id'>;
	}

	export namespace BackgroundTasksAPI {
		export interface Create extends Omit<BackgroundTask, 'id' | 'api_request'> {
			api_request: Omit<BackgroundTaskAPIRequest, 'id'>[];
		}
	}

	export namespace BackgroundTaskAPI {
		export type Update = Omit<BackgroundTask, 'id'>;
	}

	export namespace DiagramCommandAPI {
		export type Update = Pick<DiagramCommand, 'x' | 'y'>;
	}

	export namespace DiagramConditionAPI {
		export type Update = Pick<DiagramCondition, 'x' | 'y'>;
	}

	export namespace DiagramBackgroundTaskAPI {
		export type Update = Pick<DiagramBackgroundTask, 'x' | 'y'>;
	}

	export namespace VariableAPI {
		export type Create = Omit<Variable, 'id'>;
		export type Update = Create;
	}

	export namespace UserAPI {
		export type Update = Pick<User, 'is_allowed' | 'is_blocked'>;
		export type PartialUpdate = Partial<Update>;
	}

	export namespace DatabaseRecordAPI {
		export type Create = Omit<DatabaseRecord, 'id'>;
		export type Update = Create;
		export type PartialUpdate = Partial<Update>;
	}
}

export namespace APIResponse {
	export namespace StatsAPI {
		interface TelegramBotsStats {
			total: number;
			enabled: number;
		}

		interface UsersStats {
			total: number;
		}

		export interface Get {
			telegram_bots: TelegramBotsStats;
			users: UsersStats;
		}
	}

	export namespace TelegramBotsAPI {
		export type Get = TelegramBot[];
		export type Create = TelegramBot;
	}

	export namespace TelegramBotAPI {
		export type Get = TelegramBot;
		export type Update = TelegramBot;
		export type PartialUpdate = TelegramBot;
	}

	export namespace ConnectionsAPI {
		export type Create = Connection;
	}

	export namespace CommandsAPI {
		export type Get = Command[];
		export type Create = Command;
	}

	export namespace CommandAPI {
		export type Get = Command;
		export type Update = Command;
	}

	export namespace ConditionsAPI {
		export type Get = Condition[];
		export type Create = Condition;
	}

	export namespace ConditionAPI {
		export type Get = Condition;
		export type Update = Condition;
	}

	export namespace BackgroundTasksAPI {
		export type Get = BackgroundTask[];
		export type Create = BackgroundTask;
	}

	export namespace BackgroundTaskAPI {
		export type Get = BackgroundTask;
		export type Update = BackgroundTask;
	}

	export namespace DiagramCommandsAPI {
		export type Get = DiagramCommand[];
	}

	export namespace DiagramCommandAPI {
		export type Get = DiagramCommand;
	}

	export namespace DiagramConditionsAPI {
		export type Get = DiagramCondition[];
	}

	export namespace DiagramBackgroundTasksAPI {
		export type Get = DiagramBackgroundTask[];
	}

	export namespace VariablesAPI {
		export namespace Get {
			export type Default = Variable[];
			export interface Pagination {
				count: number;
				results: Variable[];
			}
		}
	}

	export namespace VariableAPI {
		export type Get = Variable;
		export type Create = Variable;
		export type Update = Variable;
	}

	export namespace UsersAPI {
		export namespace Get {
			export type Default = User[];
			export interface Pagination {
				count: number;
				results: User[];
			}
		}
	}

	export namespace UserAPI {
		export type Get = User;
		export type Update = User;
		export type PartialUpdate = User;
	}

	export namespace DatabaseRecordsAPI {
		export namespace Get {
			export type Default = DatabaseRecord[];
			export interface Pagination {
				count: number;
				results: DatabaseRecord[];
			}
		}
	}

	export namespace DatabaseRecordAPI {
		export type Get = DatabaseRecord;
		export type Create = DatabaseRecord;
		export type Update = DatabaseRecord;
		export type PartialUpdate = DatabaseRecord;
	}
}