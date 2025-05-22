import React, { forwardRef, ThHTMLAttributes } from 'react';

import TableCell from './TableCell';

import cn from 'utils/cn';

export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ scope, className, ...props }, ref) => {
    return (
      <TableCell asChild>
        <th
          {...props}
          ref={ref}
          scope={scope}
          className={cn(scope === 'row' && 'text-left', className)}
        />
      </TableCell>
    );
  },
);
TableHead.displayName = 'TableHead';

export default TableHead;
