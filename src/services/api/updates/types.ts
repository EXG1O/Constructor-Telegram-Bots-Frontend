export interface Update {
	id: number;
	version: string;
	description: string;
	added_date: string;
}

export namespace APIResponse {
	export namespace UpdatesAPI {
		export namespace Get {
			export type Default = Update[];
			export interface Pagination {
				count: number;
				results: Update[];
			}
		}
	}
}