import React, { forwardRef, type ThHTMLAttributes, useContext } from 'react';

import TableCell from './TableCell';

import TableHeaderContext from '../contexts/TableHeaderContext';

import cn from 'utils/cn';

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ scope, className, ...props }, ref) => {
    const isInHeader = useContext(TableHeaderContext);
    const resolvedScope: string | undefined = scope ?? (isInHeader ? 'col' : undefined);

    return (
      <TableCell asChild>
        <th
          {...props}
          ref={ref}
          scope={resolvedScope}
          className={cn(
            'font-semibold',
            resolvedScope === 'row' && 'text-left',
            className,
          )}
        />
      </TableCell>
    );
  },
);
TableHead.displayName = 'TableHead';

export default TableHead;
