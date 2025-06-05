import React from 'react';
import {
  PopoverArrow,
  PopoverContent,
  PopoverContentProps,
  PopoverPortal,
} from '@radix-ui/react-popover';
import { cva, VariantProps } from 'class-variance-authority';
import Z_INDEX from 'tokens/z-index';

import cn from 'utils/cn';

export const popoverBodyVariants = cva(
  [
    Z_INDEX.POPOVER,
    'bg-background',
    'text-foreground',
    'border',
    'border-outline',
    'outline-none',
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
    'origin-[--radix-popover-content-transform-origin]',
  ],
  {
    variants: {
      size: {
        sm: ['rounded-md', 'p-1.5'],
        md: ['rounded-md', 'p-2'],
        lg: ['rounded-lg', 'p-3'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface PopoverBodyProps
  extends PopoverContentProps,
    VariantProps<typeof popoverBodyVariants> {}

const PopoverBody = React.forwardRef<HTMLDivElement, PopoverBodyProps>(
  ({ sideOffset = 4, size, className, children, ...props }, ref) => (
    <PopoverPortal>
      <PopoverContent
        {...props}
        ref={ref}
        sideOffset={sideOffset}
        className={cn(popoverBodyVariants({ size, className }))}
      >
        <PopoverArrow className='fill-outline' />
        {children}
      </PopoverContent>
    </PopoverPortal>
  ),
);
PopoverBody.displayName = 'PopoverBody';

export default PopoverBody;
