import React, { forwardRef } from 'react';
import { DropdownMenuItem, DropdownMenuItemProps } from '@radix-ui/react-dropdown-menu';

import cn from 'utils/cn';

export interface MenuItemProps extends DropdownMenuItemProps {}

const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <DropdownMenuItem
        {...props}
        ref={ref}
        className={cn(
          'flex',
          'items-center',
          'justify-center',
          'text-sm',
          'text-foreground',
          'rounded-sm',
          'px-2',
          'py-1',
          'gap-1.5',
          'outline-none',
          'cursor-default',
          'select-none',
          'transition',
          'hover:bg-gray-200',
          '[&_svg]:shrink-0',
          '[&_svg]:size-3.5',
          className,
        )}
      />
    );
  },
);
MenuItem.displayName = 'MenuItem';

export default MenuItem;
