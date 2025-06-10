import React, { forwardRef, HTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';

import useTable from '../hooks/useTable';

import cn from 'utils/cn';

export const tableBodyVariants = cva([], {
  variants: {
    striped: {
      true: ['[&_tr]:not-even:bg-foreground/5'],
    },
  },
  defaultVariants: {
    striped: false,
  },
});

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    const { striped } = useTable();

    return (
      <tbody
        {...props}
        ref={ref}
        className={cn(tableBodyVariants({ striped, className }))}
      />
    );
  },
);
TableBody.displayName = 'TableBody';

export default TableBody;
