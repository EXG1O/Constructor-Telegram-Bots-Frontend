export interface User {
  id: number;
  telegram_id: number;
  full_name: string;
  is_allowed: boolean;
  is_blocked: boolean;
  activated_date: string;
}

export namespace Data {
  export namespace UserAPI {
    export type Update = Pick<User, 'is_allowed' | 'is_blocked'>;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
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
}
