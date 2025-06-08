import React, { forwardRef } from 'react';
import {
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuContentProps,
  DropdownMenuPortal,
} from '@radix-ui/react-dropdown-menu';

import MenuItem from './components/MenuItem';
import MenuSeparator from './components/MenuSeparator';

import cn from 'utils/cn';

export interface DropdownMenuProps extends DropdownMenuContentProps {}

const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ sideOffset = 2, className, children, ...props }, ref) => {
    return (
      <DropdownMenuPortal>
        <DropdownMenuContent
          {...props}
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            'block',
            'min-w-[120px]',
            'max-h-(--radix-dropdown-menu-content-available-height)',
            'bg-background',
            'border',
            'border-outline',
            'rounded-md',
            'p-1',
            'shadow-sm',
            'data-[state=open]:animate-in',
            'data-[state=open]:fade-in-0',
            'data-[state=open]:zoom-in-85',
            'data-[side=top]:slide-in-from-bottom-2',
            'data-[side=left]:slide-in-from-right-2',
            'data-[side=right]:slide-in-from-left-2',
            'data-[side=bottom]:slide-in-from-top-2',
            'data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0',
            'data-[state=closed]:zoom-out-85',
            'origin-(--radix-popover-content-transform-origin)',
            className,
          )}
        >
          <DropdownMenuArrow className='fill-outline' />
          {children}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    );
  },
);
DropdownMenu.displayName = 'DropdownMenu';

export default Object.assign(DropdownMenu, {
  Item: MenuItem,
  Separator: MenuSeparator,
});
