import { UserAPI } from 'api/users/main';
import { User } from 'api/users/types';

export interface LoaderData {
	user: User | null;
}

async function loader(): Promise<LoaderData> {
	const response = await UserAPI.get();

	return { user: response.ok ? response.json : null };
}

export default loader;
