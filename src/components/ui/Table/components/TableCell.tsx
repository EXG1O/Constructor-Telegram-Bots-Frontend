import React, { forwardRef, TdHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { DEFAULT_SIZE } from '..';

import useTable from '../hooks/useTable';

import cn from 'utils/cn';

export const tableCellVariants = cva([], {
  variants: {
    size: {
      sm: ['p-1'],
      md: ['p-2'],
    },
  },
  defaultVariants: {
    size: DEFAULT_SIZE,
  },
});

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  asChild?: boolean;
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'td';

    const { size } = useTable();

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(tableCellVariants({ size, className }))}
      />
    );
  },
);
TableCell.displayName = 'TableCell';

export default TableCell;
