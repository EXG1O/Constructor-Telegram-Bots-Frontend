import { createContext } from 'react';

import { Variable } from 'services/api/telegram_bots/types';

export interface VariableContextProps {
	variable: Variable;
}

const VariableContext = createContext<VariableContextProps | undefined>(undefined);

export default VariableContext;