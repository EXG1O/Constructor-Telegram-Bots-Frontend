import { createContext } from 'react';

import { Type } from '..';

import { User } from 'services/api/telegram_bots/types';

interface Filter {
	search: string;
	type: Type;
}

export interface UsersContextProps {
	users: User[];
	filter: Filter;
	updateUsers: (limit?: number, offset?: number, search?: string, type?: Type) => Promise<void>;
}

const UsersContext = createContext<UsersContextProps | undefined>(undefined);

export default UsersContext;