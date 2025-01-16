export interface User {
	id: number;
	telegram_id: number;
	first_name: string;
	last_name: string | null;
	full_name: string;
	is_staff: boolean;
	joined_date: string;
}

export namespace Data {
	export namespace UsersAPI {
		export interface Login {
			id: number;
			first_name: string;
			last_name?: string;
			username?: string;
			photo_url?: string;
			auth_date: number;
			hash: string;
		}
	}
}

export namespace APIResponse {
	export namespace StatsAPI {
		export interface Get {
			total: number;
		}
	}

	export namespace UserAPI {
		export type Get = User;
	}
}
