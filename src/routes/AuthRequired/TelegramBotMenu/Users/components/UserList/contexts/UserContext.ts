import { createContext } from 'react';

import { User } from 'services/api/telegram_bots/types';

export interface UserContextProps {
	user: User;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export default UserContext;