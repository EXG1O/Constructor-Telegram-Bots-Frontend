import React from 'react';
import { HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import cn from 'utils/cn';

export const paginationItemVariants = cva(
  ['border', '-ml-px', 'select-none', 'transition-colors'],
  {
    variants: {
      size: {
        sm: ['px-2', 'py-1', 'text-sm', 'first:rounded-l-sm', 'last:rounded-r-sm'],
        md: ['px-3', 'py-1', 'text-base', 'first:rounded-l-md', 'last:rounded-r-md'],
        lg: ['px-3', 'py-1.5', 'text-lg', 'first:rounded-l-lg', 'last:rounded-r-lg'],
      },
      active: {
        false: [
          'bg-background',
          'text-foreground',
          'border-outline',
          'cursor-pointer',
          'hover:bg-gray-100',
        ],
        true: ['bg-dark', 'text-dark-foreground', 'border-dark', 'pointer-events-none'],
      },
    },
    defaultVariants: {
      size: 'md',
      active: false,
    },
  },
);

export type PaginationItemProps = HTMLAttributes<HTMLLIElement> &
  VariantProps<typeof paginationItemVariants>;

function PaginationItem({ size, active, className, ...props }: PaginationItemProps) {
  return (
    <li
      {...props}
      className={cn(paginationItemVariants({ size, active, className }))}
    />
  );
}

export default PaginationItem;
