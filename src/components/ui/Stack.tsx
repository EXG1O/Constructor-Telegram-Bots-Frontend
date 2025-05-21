import React from 'react';
import { forwardRef, HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import cn from 'utils/cn';

export const stackVariants = cva(['flex', 'self-stretch'], {
  variants: {
    direction: {
      horizontal: ['flex-row'],
      vertical: ['flex-auto', 'flex-col'],
    },
  },
  defaultVariants: {
    direction: 'horizontal',
  },
});

export interface StackProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  asChild?: boolean;
}

const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ direction, className, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={cn(stackVariants({ direction, className }))}
      />
    );
  },
);
Stack.displayName = 'Stack';

export default Stack;
