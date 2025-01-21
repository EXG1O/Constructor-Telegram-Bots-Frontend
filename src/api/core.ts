import { UserAPI } from './users/main';

export namespace APIResponse {
  export interface Base<Ok extends boolean, Json extends Record<string, any>>
    extends Omit<Response, 'ok' | 'json'> {
    ok: Ok;
    json: Json;
  }

  export interface ErrorDetail {
    code: string;
    detail: string;
    attr: string | null;
  }

  export interface ErrorList {
    type: 'server_error' | 'client_error' | 'validation_error';
    errors: ErrorDetail[];
  }
}

export async function makeRequest<
  SuccessAPIResponse extends Record<string, any> = Record<string, never>,
  ErrorAPIResponse extends Record<string, any> = APIResponse.ErrorList,
>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  data?: Record<string, any> | FormData,
  authRequired: boolean = false,
): Promise<
  APIResponse.Base<true, SuccessAPIResponse> | APIResponse.Base<false, ErrorAPIResponse>
> {
  let init: RequestInit = { method };

  if (data !== undefined) {
    if (data instanceof FormData) {
      init = Object.assign(init, { body: data });
    } else {
      init = Object.assign(init, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }
  }

  const customFetch = async (): Promise<Response> => {
    const response: Response = await fetch(url, init);

    if (authRequired && response.status === 403) {
      const refreshResponse = await UserAPI.tokenRefresh();

      if (refreshResponse.ok) {
        return await fetch(url, init);
      }
    }

    return response;
  };

  const response: Response = await customFetch();
  const json: any = await response.json().catch(() => ({}));

  return Object.assign(response, { json });
}
