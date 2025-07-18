export interface Variable {
  id: number;
  name: string;
  value: string;
  description: string;
}

export namespace Data {
  export namespace VariablesAPI {
    export type Create = Omit<Variable, 'id'>;
  }

  export namespace VariableAPI {
    export type Update = VariablesAPI.Create;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
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
}
