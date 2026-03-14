import type { DiagramBlock } from '../base/types';

export interface TemporaryVariable {
  id: number;
  name: string;
  value: string;
}

export interface DiagramTemporaryVariable
  extends DiagramBlock<TemporaryVariable['id']>, Pick<TemporaryVariable, 'value'> {}

export namespace Data {
  export namespace TemporaryVariablesAPI {
    export type Create = Omit<TemporaryVariable, 'id'>;
  }

  export namespace TemporaryVariableAPI {
    export type Update = TemporaryVariablesAPI.Create;
    export type PartialUpdate = Partial<Update>;
  }

  export namespace DiagramTemporaryVariableAPI {
    export type Update = Pick<DiagramTemporaryVariable, 'x' | 'y'>;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
  export namespace TemporaryVariablesAPI {
    export type Get = TemporaryVariable[];
    export type Create = TemporaryVariableAPI.Get;
  }

  export namespace TemporaryVariableAPI {
    export type Get = TemporaryVariable;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace DiagramTemporaryVariablesAPI {
    export type Get = DiagramTemporaryVariable[];
  }

  export namespace DiagramTemporaryVariableAPI {
    export type Get = DiagramTemporaryVariable;
    export type Update = Get;
    export type PartialUpdate = Get;
  }
}
