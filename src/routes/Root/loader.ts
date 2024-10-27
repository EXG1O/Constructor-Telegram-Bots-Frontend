import { UserAPI } from 'services/api/users/main';
import { User } from 'services/api/users/types';

export interface LoaderData {
	user: User | null;
}

async function loader(): Promise<LoaderData> {
	const response = await UserAPI.get();

	return { user: response.ok ? response.json : null };
}

export default loader;
