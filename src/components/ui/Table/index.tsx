import React from 'react';
import { forwardRef, TableHTMLAttributes } from 'react';

import TableBody from './components/TableBody';
import TableCell from './components/TableCell';
import TableHead from './components/TableHead';
import TableHeader from './components/TableHeader';
import TableRow from './components/TableRow';
import TableContext, { TableContextProps } from './contexts/TableContext';

import cn from 'utils/cn';

export type TableProps = TableHTMLAttributes<HTMLTableElement> &
  Partial<TableContextProps>;

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ size = 'md', striped = false, className, children, ...props }, ref) => {
    return (
      <div className='block w-full overflow-auto'>
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
