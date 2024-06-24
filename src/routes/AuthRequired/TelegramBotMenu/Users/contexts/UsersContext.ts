import { createContext } from 'react';

import { User } from 'services/api/telegram_bots/types';

import { Type } from '..';

interface Filter {
	search: string;
	type: Type;
}

export interface UsersContextProps {
	users: User[];
	filter: Filter;
	updateUsers: (
		limit?: number,
		offset?: number,
		search?: string,
		type?: Type,
	) => Promise<void>;
}

const UsersContext = createContext<UsersContextProps | undefined>(undefined);

export default UsersContext;
