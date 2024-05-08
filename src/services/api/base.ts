export namespace APIResponse {
	export interface Base<Ok extends boolean, Json extends Record<string, any>>
		extends Omit<Response, 'ok' | 'json'> {
		ok: Ok;
		json: Json;
	}

	interface ErrorDetail {
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
	SuccessAPIResponse extends Record<string, any> = {},
	ErrorAPIResponse extends Record<string, any> = APIResponse.ErrorList,
>(
	url: string,
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
	data?: Record<string, any> | FormData,
): Promise<
	| APIResponse.Base<true, SuccessAPIResponse>
	| APIResponse.Base<false, ErrorAPIResponse>
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

	const response: Response = await fetch(url, init);

	let json: any = {};

	try {
		json = await response.json();
	} catch {}

	return Object.assign(response, { json });
}
