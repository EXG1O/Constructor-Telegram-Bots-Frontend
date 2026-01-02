import { DiagramBlock } from '../diagram/types';

export interface BackgroundTask {
  id: number;
  name: string;
  interval: 1 | 3 | 7 | 14 | 28;
}

export interface DiagramBackgroundTask
  extends DiagramBlock<BackgroundTask['id']>,
    Pick<BackgroundTask, 'name' | 'interval'> {}

export namespace Data {
  export namespace BackgroundTasksAPI {
    export type Create = Omit<BackgroundTask, 'id'>;
  }

  export namespace BackgroundTaskAPI {
    export type Update = BackgroundTasksAPI.Create;
    export type PartialUpdate = Partial<Update>;
  }

  export namespace DiagramBackgroundTaskAPI {
    export type Update = Pick<DiagramBackgroundTask, 'x' | 'y'>;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
  export namespace BackgroundTasksAPI {
    export type Get = BackgroundTask[];
    export type Create = BackgroundTaskAPI.Get;
  }

  export namespace BackgroundTaskAPI {
    export type Get = BackgroundTask;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace DiagramBackgroundTasksAPI {
    export type Get = DiagramBackgroundTask[];
  }

  export namespace DiagramBackgroundTaskAPI {
    export type Get = DiagramBackgroundTask;
    export type Update = Get;
    export type PartialUpdate = Get;
  }
}
