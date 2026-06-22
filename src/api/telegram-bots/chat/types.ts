import type { ChatType } from './enums';

export interface Chat {
  id: number;
  telegram_id: number;
  type: ChatType;
  title: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  is_forum: boolean;
  is_direct_messages: boolean;
  is_allowed: boolean;
  is_blocked: boolean;
}

export namespace Data {
  export namespace ChatAPI {
    export type Update = Pick<Chat, 'is_allowed' | 'is_blocked'>;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
  export namespace ChatsAPI {
    export namespace Get {
      export type Default = Chat[];
      export interface Pagination {
        count: number;
        results: Chat[];
      }
    }
  }

  export namespace ChatAPI {
    export type Get = Chat;
    export type Update = Get;
    export type PartialUpdate = Get;
  }
}
