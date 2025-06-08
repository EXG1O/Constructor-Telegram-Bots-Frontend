import React, { forwardRef } from 'react';
import {
  DropdownMenuSeparator,
  DropdownMenuSeparatorProps,
} from '@radix-ui/react-dropdown-menu';

import cn from 'utils/cn';

export interface MenuSeparatorProps extends DropdownMenuSeparatorProps {}

const MenuSeparator = forwardRef<HTMLDivElement, MenuSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <DropdownMenuSeparator
        {...props}
        ref={ref}
        className={cn('block', 'h-px', 'bg-outline', '-mx-1', 'my-1', className)}
      />
    );
  },
);
MenuSeparator.displayName = 'MenuSeparator';

export default MenuSeparator;
