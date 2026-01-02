import { DiagramBlock } from '../diagram/types';

export interface DatabaseCreateOperation {
  data: any[] | Record<string, any>;
}

export interface DatabaseUpdateOperation {
  overwrite: boolean;
  lookup_field_name: string;
  lookup_field_value: string;
  create_if_not_found: boolean;
  new_data: any[] | Record<string, any>;
}

export interface DatabaseOperation {
  id: number;
  name: string;
  create_operation: DatabaseCreateOperation | null;
  update_operation: DatabaseUpdateOperation | null;
}

export interface DiagramDatabaseOperation
  extends DiagramBlock<DatabaseOperation['id']> {}

export namespace Data {
  export namespace DatabaseOperationsAPI {
    export type Create = Omit<DatabaseOperation, 'id'>;
  }

  export namespace DatabaseOperationAPI {
    export type Update = DatabaseOperationsAPI.Create;

    export interface PartialUpdate
      extends Partial<Omit<Update, 'create_operation' | 'update_operation'>> {
      create_operation?: Partial<Update['create_operation']>;
      update_operation?: Partial<Update['update_operation']>;
    }
  }

  export namespace DiagramDatabaseOperationAPI {
    export type Update = Pick<DiagramDatabaseOperation, 'x' | 'y'>;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
  export namespace DatabaseOperationsAPI {
    export type Get = DatabaseOperation[];
    export type Create = DatabaseOperationAPI.Get;
  }

  export namespace DatabaseOperationAPI {
    export type Get = DatabaseOperation;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace DiagramDatabaseOperationsAPI {
    export type Get = DiagramDatabaseOperation[];
  }

  export namespace DiagramDatabaseOperationAPI {
    export type Get = DiagramDatabaseOperation;
    export type Update = Get;
    export type PartialUpdate = Get;
  }
}
