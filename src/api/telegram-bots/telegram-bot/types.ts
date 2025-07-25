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

export namespace Data {
  export namespace TelegramBotsAPI {
    export type Create = Pick<TelegramBot, 'api_token' | 'is_private'>;
  }

  export namespace TelegramBotAPI {
    export type Update = TelegramBotsAPI.Create;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
  export namespace TelegramBotsAPI {
    export type Get = TelegramBot[];
    export type Create = TelegramBotAPI.Get;
  }

  export namespace TelegramBotAPI {
    export type Get = TelegramBot;
    export type Update = Get;
    export type PartialUpdate = Get;
  }
}
