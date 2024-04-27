import { useContext } from 'react';

import RecordsContext, { RecordsContextProps } from '../contexts/RecordsContext';

function useRecords(): RecordsContextProps {
	const context = useContext<RecordsContextProps | undefined>(RecordsContext);

	if (context === undefined) {
		throw new Error('useRecords must be used with a RecordsContext.Provider!');
	}

	return context;
}

export default useRecords;