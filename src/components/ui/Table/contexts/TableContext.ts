import { createContext } from 'react';

export interface TableContextProps {
  size: 'sm' | 'md';
  striped: boolean;
}

const TableContext = createContext<TableContextProps | undefined>(undefined);

export default TableContext;
