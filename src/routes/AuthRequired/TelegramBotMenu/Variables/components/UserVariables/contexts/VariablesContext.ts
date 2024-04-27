import { createContext } from 'react';

import { Variable } from 'services/api/telegram_bots/types';

interface Filter {
	search: string;
}

export interface VariablesContextProps {
	variables: Variable[];
	filter: Filter;
	updateVariables: (limit?: number, offset?: number, search?: string) => Promise<void>;
}

const VariablesContext = createContext<VariablesContextProps | undefined>(undefined);

export default VariablesContext;