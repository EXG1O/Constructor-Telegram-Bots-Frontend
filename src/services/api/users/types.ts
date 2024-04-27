export interface User {
	id: number;
	telegram_id: number;
	first_name: string;
	last_name: string;
	full_name: string;
	is_staff: boolean;
	joined_date: string;
}

export namespace Data {
	export namespace UserAPI {
		export interface Login {
			user_id: number;
			confirm_code: string;
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