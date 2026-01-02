import { DiagramBlock } from '../diagram/types';

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface APIRequest {
  id: number;
  name: string;
  url: string;
  method: Method;
  headers: Record<string, string> | null;
  body: any[] | Record<string, any> | null;
}

export interface DiagramAPIRequest extends DiagramBlock<APIRequest['id']> {}

export namespace Data {
  export namespace APIRequestsAPI {
    export type Create = Omit<APIRequest, 'id'>;
  }

  export namespace APIRequestAPI {
    export type Update = Omit<APIRequest, 'id'>;
    export type PartialUpdate = Partial<Update>;
  }

  export namespace DiagramAPIRequestAPI {
    export type Update = Pick<DiagramAPIRequest, 'x' | 'y'>;
    export type PartialUpdate = Partial<Update>;
  }
}

export namespace APIResponse {
  export namespace APIRequestsAPI {
    export type Get = APIRequest[];
    export type Create = APIRequestAPI.Get;
  }

  export namespace APIRequestAPI {
    export type Get = APIRequest;
    export type Update = Get;
    export type PartialUpdate = Get;
  }

  export namespace DiagramAPIRequestsAPI {
    export type Get = DiagramAPIRequest[];
  }

  export namespace DiagramAPIRequestAPI {
    export type Get = DiagramAPIRequest;
    export type Update = Get;
    export type PartialUpdate = Get;
  }
}
