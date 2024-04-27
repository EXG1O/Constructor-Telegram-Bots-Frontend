import { useContext } from 'react';

import UserContext, { UserContextProps } from '../contexts/UserContext';

function useUser(): UserContextProps {
	const context = useContext<UserContextProps | undefined>(UserContext);

	if (context === undefined) {
		throw new Error('useUser must be used with a UserContext.Provider!');
	}

	return context;
}

export default useUser;