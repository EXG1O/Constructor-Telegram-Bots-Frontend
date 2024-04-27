import { useContext } from 'react';

import VariablesContext, { VariablesContextProps } from '../contexts/VariablesContext';

function useVariables(): VariablesContextProps {
	const context = useContext<VariablesContextProps | undefined>(VariablesContext);

	if (context === undefined) {
		throw new Error('useVariables must be used with a VariablesContext.Provider!');
	}

	return context;
}

export default useVariables;