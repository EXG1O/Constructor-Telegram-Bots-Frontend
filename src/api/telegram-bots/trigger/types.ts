import { DiagramBlock } from '../diagram/types';

export interface TriggerCommand {
  command: string;
  payload: string | null;
  description: string | null;
}

export interface TriggerMessage {
  text: string | null;
}

export interface Trigger {
  id: number;
  name: string;
  command: TriggerCommand | null;
  message: TriggerMessage | null;
}

export interface DiagramTrigger extends DiagramBlock<Trigger['id']> {}

export namespace Data {
  export namespace TriggersAPI {
    export type Create = Omit<Trigger, 'id'>;
  }

  export namespace TriggerAPI {
    export type Update = TriggersAPI.Create;

    export interface PartialUpdate extends Partial<Pick<Trigger, 'name'>> {
      command?: Partial<Update['command']>;
      message?: Partial<Update['message']>;
    }
  }

  export namespace DiagramTriggerAPI {
    export type Update = Pick<DiagramTrigger, 'x' | 'y'>;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
  export namespace TriggersAPI {
    export type Get = Trigger[];
    export type Create = TriggerAPI.Get;
  }

  export namespace TriggerAPI {
    export type Get = Trigger;
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
}
