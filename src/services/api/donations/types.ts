export interface Donation {
	id: number;
	sum: number;
	sender: string;
	date: string;
}

export interface Section {
	id: number;
	title: string;
	text: string;
}

export interface Method {
	id: number;
	text: string;
	link: string | null;
	value: string | null;
}

export namespace APIResponse {
	export namespace DonationsAPI {
		export namespace Get {
			export type Default = Donation[];
			export interface Pagination {
				count: number;
				results: Donation[];
			}
		}
	}

	export namespace SectionsAPI {
		export type Get = Section[];
	}

	export namespace MethodsAPI {
		export type Get = Method[];
	}
}
