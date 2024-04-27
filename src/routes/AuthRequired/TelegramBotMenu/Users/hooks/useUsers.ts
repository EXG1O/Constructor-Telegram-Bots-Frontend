import { useContext } from 'react';

import UsersContext, { UsersContextProps } from '../contexts/UsersContext';

function useUsers(): UsersContextProps {
	const context = useContext<UsersContextProps | undefined>(UsersContext);

	if (context === undefined) {
		throw new Error('useUsers must be used with a UsersContext.Provider!');
	}

	return context;
}

export default useUsers;