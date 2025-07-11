import React from 'react';
import { forwardRef, TableHTMLAttributes } from 'react';

import TableBody from './components/TableBody';
import TableCell from './components/TableCell';
import TableHead from './components/TableHead';
import TableHeader from './components/TableHeader';
import TableRow from './components/TableRow';
import TableContext, { TableContextProps } from './contexts/TableContext';

import cn from 'utils/cn';

export type Size = 'sm' | 'md';

export const DEFAULT_SIZE: Size = 'md';

export interface TableProps
  extends TableHTMLAttributes<HTMLTableElement>,
    Partial<TableContextProps> {}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ size = DEFAULT_SIZE, striped = false, className, children, ...props }, ref) => {
    return (
      <div className='w-full overflow-auto'>
        <table {...props} ref={ref} className={cn('w-full', className)}>
          <TableContext.Provider value={{ size, striped }}>
            {children}
          </TableContext.Provider>
        </table>
      </div>
    );
  },
);
Table.displayName = 'Table';

export default Object.assign(Table, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Cell: TableCell,
  Head: TableHead,
});
