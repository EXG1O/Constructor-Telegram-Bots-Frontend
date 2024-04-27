import { useContext } from 'react';

import VariableContext, { VariableContextProps } from '../contexts/VariableContext';

function useVariable(): VariableContextProps {
	const context = useContext<VariableContextProps | undefined>(VariableContext);

	if (context === undefined) {
		throw new Error('useVariable must be used with a VariableContext.Provider!');
	}

	return context;
}

export default useVariable;