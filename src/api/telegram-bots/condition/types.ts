import { DiagramBlock } from '../base/types';

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

export interface DiagramCondition extends DiagramBlock<Condition['id']> {}

export namespace Data {
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

  export namespace DiagramConditionAPI {
    export type Update = Pick<DiagramCondition, 'x' | 'y'>;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
  export namespace ConditionsAPI {
    export type Get = Condition[];
    export type Create = ConditionAPI.Get;
  }

  export namespace ConditionAPI {
    export type Get = Condition;
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
}
