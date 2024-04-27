import Cookies from 'js-cookie';

import { LanguagesAPI } from 'services/api/languages/main';
import { APIResponse } from 'services/api/languages/types';

export interface Languages {
	current: string;
	available: APIResponse.LanguagesAPI.Get;
}

export interface LoaderData {
	languages: Languages;
}

export async function loader(): Promise<LoaderData> {
	const response = await LanguagesAPI.get();

	if (!response.ok) {
		throw Error('Failed to fetch data!');
	}

	return {
		languages: {
			current: Cookies.get('lang') ?? 'ru',
			available: response.json,
		},
	}
}