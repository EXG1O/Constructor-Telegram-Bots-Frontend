export interface DatabaseRecord {
  id: number;
  data: Record<string, any>;
}

export namespace Data {
  export namespace DatabaseRecordsAPI {
    export type Create = Omit<DatabaseRecord, 'id'>;
  }

  export namespace DatabaseRecordAPI {
    export type Update = DatabaseRecordsAPI.Create;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
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
