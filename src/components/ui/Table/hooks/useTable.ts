import { useContext } from 'react';

import TableContext, { TableContextProps } from '../contexts/TableContext';

function useTable(): TableContextProps {
  const context = useContext<TableContextProps | undefined>(TableContext);

  if (context === undefined) {
    throw new Error('useTable must be used with a TableContext.');
  }

  return context;
}

export default useTable;
