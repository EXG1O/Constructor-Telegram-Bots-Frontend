import { ButtonsAPI, SectionsAPI } from 'services/api/donations/main';
import { APIResponse } from 'services/api/donations/types';

export interface LoaderData {
	sections: APIResponse.SectionsAPI.Get;
	buttons: APIResponse.ButtonsAPI.Get;
}

async function loader(): Promise<LoaderData> {
	const [sectionsResponse, buttonsResponse] = await Promise.all([
		SectionsAPI.get(),
		ButtonsAPI.get(),
	]);

	if (!sectionsResponse.ok || !buttonsResponse.ok) {
		throw Error('Failed to fetch data.');
	}

	return {
		sections: sectionsResponse.json,
		buttons: buttonsResponse.json,
	};
}

export default loader;
