import type { Block, CreateBlock, DiagramBlock } from '../base/types';

export interface Randomizer extends Block<number> {}

export interface DiagramRandomizer extends DiagramBlock<Randomizer['id']> {}

export namespace Data {
  export namespace RandomizersAPI {
    export type Create = CreateBlock & Omit<Randomizer, 'id'>;
  }

  export namespace RandomizerAPI {
    export type Update = RandomizersAPI.Create;
    export type PartialUpdate = Partial<Update>;
  }

  export namespace DiagramRandomizerAPI {
    export type Update = Pick<DiagramRandomizer, 'x' | 'y'>;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
  export namespace RandomizersAPI {
    export type Get = Randomizer[];
    export type Create = RandomizerAPI.Get;
  }

  export namespace RandomizerAPI {
    export type Get = Randomizer;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace DiagramRandomizersAPI {
    export type Get = DiagramRandomizer[];
  }

  export namespace DiagramRandomizerAPI {
    export type Get = DiagramRandomizer;
    export type Update = Get;
    export type PartialUpdate = Get;
  }
}
