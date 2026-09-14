import type { Block, CreateBlock, DiagramBlock } from '../base/types';

export interface Timer extends Block<number> {
  duration_seconds: number;
}

export interface DiagramTimer
  extends DiagramBlock<Timer['id']>, Pick<Timer, 'duration_seconds'> {}

export namespace Data {
  export namespace TimersAPI {
    export type Create = CreateBlock & Omit<Timer, 'id'>;
  }

  export namespace TimerAPI {
    export type Update = TimersAPI.Create;
    export type PartialUpdate = Partial<Update>;
  }

  export namespace DiagramTimerAPI {
    export type Update = Pick<DiagramTimer, 'x' | 'y'>;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
  export namespace TimersAPI {
    export type Get = Timer[];
    export type Create = TimerAPI.Get;
  }

  export namespace TimerAPI {
    export type Get = Timer;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace DiagramTimersAPI {
    export type Get = DiagramTimer[];
  }

  export namespace DiagramTimerAPI {
    export type Get = DiagramTimer;
    export type Update = Get;
    export type PartialUpdate = Get;
  }
}
