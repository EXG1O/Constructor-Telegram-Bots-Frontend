import { createContext } from 'react';

import { DatabaseRecord } from 'services/api/telegram_bots/types';

interface Filter {
	search: string;
}

export interface RecordsContextProps {
	records: DatabaseRecord[];
	filter: Filter;
	updateRecords: (limit?: number, offset?: number, search?: string) => Promise<void>;
}

const RecordsContext = createContext<RecordsContextProps | undefined>(undefined);

export default RecordsContext;