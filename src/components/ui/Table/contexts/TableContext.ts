import { createContext } from 'react';

import { Size } from '..';

export interface TableContextProps {
  size: Size;
  striped: boolean;
}

const TableContext = createContext<TableContextProps | undefined>(undefined);

export default TableContext;
