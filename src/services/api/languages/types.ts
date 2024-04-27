export namespace Data {
	export namespace LanguagesAPI {
		export interface Set {
			lang_code: string;
		}
	}
}

export namespace APIResponse {
	export namespace LanguagesAPI {
		export type Get = Record<string, string>;
		export type Set = {};
	}
}