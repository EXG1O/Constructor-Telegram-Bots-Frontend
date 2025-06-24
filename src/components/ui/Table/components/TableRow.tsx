import React, { forwardRef, HTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';

import useTable from '../hooks/useTable';

import cn from 'utils/cn';

export const tableRowVariants = cva([], {
  variants: {
    striped: {
      true: ['not-even:bg-foreground/5'],
    },
  },
  defaultVariants: {
    striped: false,
  },
});

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => {
    const { striped } = useTable();

    return (
      <tr
        {...props}
        ref={ref}
        className={cn(tableRowVariants({ striped, className }))}
      />
    );
  },
);
TableRow.displayName = 'TableRow';

export default TableRow;
