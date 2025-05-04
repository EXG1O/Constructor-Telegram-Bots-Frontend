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
  source_object_type:
    | 'trigger'
    | 'command_keyboard_button'
    | 'condition'
    | 'background_task';
  source_object_id: number;
  source_handle_position: HandlePositions;
  target_object_type: 'command' | 'condition';
  target_object_id: number;
  target_handle_position: HandlePositions;
}

export interface APIRequest {
  url: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  headers: Record<string, any>[] | null;
  body: Record<string, any> | null;
}

export interface TriggerCommand {
  command: string;
  payload: string | null;
  description: string | null;
}

export interface TriggerMessage {
  text: string;
}

export interface Trigger {
  id: number;
  name: string;
  command: TriggerCommand | null;
  message: TriggerMessage | null;
}

export interface CommandSettings {
  is_reply_to_user_message: boolean;
  is_delete_user_message: boolean;
  is_send_as_new_message: boolean;
}

export interface CommandMedia {
  id: number;
  position: number;
  name: string | null;
  size: number | null;
  url: string | null;
  from_url: string | null;
}

export type CommandImage = CommandMedia;
export type CommandDocument = CommandMedia;

export interface CommandMessage {
  text: string;
}

export interface CommandKeyboardButton {
  id: number;
  row: number;
  position: number;
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
  images: CommandImage[];
  documents: CommandDocument[];
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

export type DiagramTrigger = Pick<Trigger, 'id' | 'name'> &
  Omit<DiagramBlock, 'target_connections'>;

export interface DiagramCommandKeyboardButton extends CommandKeyboardButton {
  source_connections: Connection[];
}

export interface DiagramCommandKeyboard extends Pick<CommandKeyboard, 'type'> {
  buttons: DiagramCommandKeyboardButton[];
}

export interface DiagramCommand
  extends Pick<Command, 'id' | 'name' | 'message'>,
    Omit<DiagramBlock, 'source_connections'> {
  keyboard: DiagramCommandKeyboard | null;
}

export type DiagramCondition = Pick<Condition, 'id' | 'name'> & DiagramBlock;

export type DiagramBackgroundTask = Pick<BackgroundTask, 'id' | 'name' | 'interval'> &
  Omit<DiagramBlock, 'target_connections'>;

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

  export namespace TriggersAPI {
    export type Create = Omit<Trigger, 'id'>;
  }

  export namespace TriggerAPI {
    export type Update = TriggersAPI.Create;

    export interface PartialUpdateTriggerCommand
      extends Pick<TriggerCommand, 'command'> {
      payload?: string | null;
      description?: string | null;
    }

    export interface PartialUpdate extends Partial<Pick<Trigger, 'name'>> {
      command?: PartialUpdateTriggerCommand | null;
      message?: Partial<Update['message']>;
    }
  }

  export namespace CommandsAPI {
    export interface CreateCommandMedia
      extends Omit<CommandMedia, 'id' | 'name' | 'size' | 'url'> {
      file: File | null;
    }

    export type CreateCommandKeyboardButton = Omit<CommandKeyboardButton, 'id'>;

    export interface CreateCommandKeyboard extends Omit<CommandKeyboard, 'buttons'> {
      buttons: CreateCommandKeyboardButton[];
    }

    export interface Create
      extends Omit<Command, 'id' | 'images' | 'documents' | 'keyboard'> {
      images: CreateCommandMedia[] | null;
      documents: CreateCommandMedia[] | null;
      keyboard: CreateCommandKeyboard | null;
    }
  }

  export namespace CommandAPI {
    export interface UpdateCommandMedia extends CommandsAPI.CreateCommandMedia {
      id?: CommandMedia['id'];
    }

    export interface UpdateCommandKeyboardButton
      extends CommandsAPI.CreateCommandKeyboardButton {
      id?: CommandKeyboardButton['id'];
    }

    export interface UpdateCommandKeyboard extends Omit<CommandKeyboard, 'buttons'> {
      buttons: UpdateCommandKeyboardButton[];
    }

    export interface Update
      extends Omit<Command, 'id' | 'images' | 'documents' | 'keyboard'> {
      images: UpdateCommandMedia[] | null;
      documents: UpdateCommandMedia[] | null;
      keyboard: UpdateCommandKeyboard | null;
    }

    export interface PartialUpdateCommandKeyboard
      extends Partial<Omit<UpdateCommandKeyboard, 'buttons'>> {
      buttons?: Partial<UpdateCommandKeyboard['buttons']>;
    }

    export interface PartialUpdate extends Partial<Pick<Update, 'name'>> {
      settings?: Partial<Update['settings']>;
      images?: Partial<UpdateCommandMedia>[] | null;
      documents?: Partial<UpdateCommandMedia>[] | null;
      message?: Partial<Update['message']>;
      keyboard?: PartialUpdateCommandKeyboard;
      api_request?: Partial<Update['api_request']>;
      database_record?: Partial<Update['database_record']>;
    }
  }

  export namespace ConditionsAPI {
    export interface Create extends Omit<Condition, 'id' | 'parts'> {
      parts: Omit<ConditionPart, 'id'>[];
    }
  }

  export namespace ConditionAPI {
    interface UpdateConditionPart extends Omit<ConditionPart, 'id'> {
      id?: ConditionPart['id'];
    }

    export interface Update extends Omit<Condition, 'id' | 'parts'> {
      parts: UpdateConditionPart[];
    }

    export interface PartialUpdate extends Partial<Omit<Condition, 'id' | 'parts'>> {
      parts: Partial<ConditionPart>[];
    }
  }

  export namespace BackgroundTasksAPI {
    export type Create = Omit<BackgroundTask, 'id'>;
  }

  export namespace BackgroundTaskAPI {
    export type Update = BackgroundTasksAPI.Create;

    export interface PartialUpdate extends Omit<BackgroundTask, 'id' | 'api_request'> {
      api_request?: Partial<BackgroundTaskAPIRequest>;
    }
  }

  export namespace DiagramTriggerAPI {
    export type Update = Pick<DiagramTrigger, 'x' | 'y'>;
    export type PartialUpdate = Partial<Update>;
  }

  export namespace DiagramCommandAPI {
    export type Update = Pick<DiagramCommand, 'x' | 'y'>;
    export type PartialUpdate = Partial<Update>;
  }

  export namespace DiagramConditionAPI {
    export type Update = Pick<DiagramCondition, 'x' | 'y'>;
    export type PartialUpdate = Partial<Update>;
  }

  export namespace DiagramBackgroundTaskAPI {
    export type Update = Pick<DiagramBackgroundTask, 'x' | 'y'>;
    export type PartialUpdate = Partial<Update>;
  }

  export namespace VariablesAPI {
    export type Create = Omit<Variable, 'id'>;
  }

  export namespace VariableAPI {
    export type Update = VariablesAPI.Create;
    export type PartialUpdate = Partial<Update>;
  }

  export namespace UserAPI {
    export type Update = Pick<User, 'is_allowed' | 'is_blocked'>;
    export type PartialUpdate = Partial<Update>;
  }

  export namespace DatabaseRecordsAPI {
    export type Create = Omit<DatabaseRecord, 'id'>;
  }

  export namespace DatabaseRecordAPI {
    export type Update = DatabaseRecordsAPI.Create;
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
    export type Create = TelegramBotAPI.Get;
  }

  export namespace TelegramBotAPI {
    export type Get = TelegramBot;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace ConnectionsAPI {
    export type Create = Connection;
  }

  export namespace TriggersAPI {
    export type Get = Trigger[];
    export type Create = TriggerAPI.Get;
  }

  export namespace TriggerAPI {
    export type Get = Trigger;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace CommandsAPI {
    export type Get = Command[];
    export type Create = CommandAPI.Get;
  }

  export namespace CommandAPI {
    export type Get = Command;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace ConditionsAPI {
    export type Get = Condition[];
    export type Create = ConditionAPI.Get;
  }

  export namespace ConditionAPI {
    export type Get = Condition;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace BackgroundTasksAPI {
    export type Get = BackgroundTask[];
    export type Create = BackgroundTaskAPI.Get;
  }

  export namespace BackgroundTaskAPI {
    export type Get = BackgroundTask;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace DiagramTriggersAPI {
    export type Get = DiagramTrigger[];
  }

  export namespace DiagramTriggerAPI {
    export type Get = DiagramTrigger;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace DiagramCommandsAPI {
    export type Get = DiagramCommand[];
  }

  export namespace DiagramCommandAPI {
    export type Get = DiagramCommand;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace DiagramConditionsAPI {
    export type Get = DiagramCondition[];
  }

  export namespace DiagramConditionAPI {
    export type Get = DiagramCondition;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace DiagramBackgroundTasksAPI {
    export type Get = DiagramBackgroundTask[];
  }

  export namespace DiagramBackgroundTaskAPI {
    export type Get = DiagramBackgroundTask;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace VariablesAPI {
    export namespace Get {
      export type Default = Variable[];
      export interface Pagination {
        count: number;
        results: Variable[];
      }
    }
    export type Create = VariableAPI.Get;
  }

  export namespace VariableAPI {
    export type Get = Variable;
    export type Update = Get;
    export type PartialUpdate = Get;
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
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace DatabaseRecordsAPI {
    export namespace Get {
      export type Default = DatabaseRecord[];
      export interface Pagination {
        count: number;
        results: DatabaseRecord[];
      }
    }
    export type Create = DatabaseRecordAPI.Get;
  }

  export namespace DatabaseRecordAPI {
    export type Get = DatabaseRecord;
    export type Update = Get;
    export type PartialUpdate = Get;
  }
}
