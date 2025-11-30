export type ObjectType =
  | 'trigger'
  | 'command'
  | 'command_keyboard_button'
  | 'condition'
  | 'background_task'
  | 'api_request'
  | 'database_operation';
export type SourceObjectType = Extract<
  ObjectType,
  | 'trigger'
  | 'command'
  | 'command_keyboard_button'
  | 'condition'
  | 'background_task'
  | 'api_request'
  | 'database_operation'
>;
export type TargetObjectType = Extract<
  ObjectType,
  'trigger' | 'command' | 'condition' | 'api_request' | 'database_operation'
>;

export type HandlePosition = 'left' | 'right';

export interface Connection {
  id: number;
  source_object_type: SourceObjectType;
  source_object_id: number;
  source_handle_position: HandlePosition;
  target_object_type: TargetObjectType;
  target_object_id: number;
  target_handle_position: HandlePosition;
}

export namespace Data {
  export namespace ConnectionsAPI {
    export type Create = Omit<Connection, 'id'>;
  }
}

export namespace APIResponse {
  export namespace ConnectionsAPI {
    export type Create = Connection;
  }
}
