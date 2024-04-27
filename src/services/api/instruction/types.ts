export interface Section {
	id: number;
	title: string;
	text: string;
}

export namespace APIResponse {
	export namespace SectionsAPI {
		export type Get = Section[];
	}
}