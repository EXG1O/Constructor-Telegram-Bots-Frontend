import React, { forwardRef, LiHTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';

import { DEFAULT_SIZE } from '..';

import useList from '../hooks/useList';

import cn from 'utils/cn';

export const listItemVariants = cva(['w-full'], {
  variants: {
    size: {
      sm: ['p-1'],
      md: ['p-2'],
    },
    striped: {
      true: ['not-even:bg-foreground/5'],
    },
  },
  defaultVariants: {
    size: DEFAULT_SIZE,
    striped: false,
  },
});

export interface ListItemProps extends LiHTMLAttributes<HTMLLIElement> {}

const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, ...props }, ref) => {
    const { size, striped } = useList();

    return (
      <li
        {...props}
        ref={ref}
        className={cn(listItemVariants({ size, striped, className }))}
      />
    );
  },
);
ListItem.displayName = 'ListItem';

export default ListItem;
