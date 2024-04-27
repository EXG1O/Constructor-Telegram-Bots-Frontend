export interface Donation {
	id: number;
	sum: number;
	contact_link: string;
	date: string;
}

export interface Section {
	id: number;
	title: string;
	text: string;
}

export interface Button {
	id: number;
	text: string;
	url: string;
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

	export namespace ButtonsAPI {
		export type Get = Button[];
	}
}