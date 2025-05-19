import React, { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';

import cn from 'utils/cn';

export const blockVariants = cva(['rounded-2xl', 'p-3'], {
  variants: {
    variant: {
      light: ['bg-light', 'text-light-foreground'],
      dark: ['bg-dark', 'text-dark-foreground'],
      primary: ['bg-primary', 'text-primary-foreground'],
    },
    gradient: {
      true: 'bg-gradient-to-r',
    },
  },
  compoundVariants: [
    {
      variant: 'dark',
      gradient: true,
      className: ['from-dark', 'to-dark/80'],
    },
    {
      variant: 'primary',
      gradient: true,
      className: ['from-primary', 'to-primary/80'],
    },
  ],
  defaultVariants: {
    variant: 'light',
  },
});

export interface BlockProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof blockVariants> {
  asChild?: boolean;
}

const Block = forwardRef<HTMLDivElement, BlockProps>(
  ({ asChild, variant, gradient, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(blockVariants({ variant, gradient, className }))}
      />
    );
  },
);
Block.displayName = 'Block';

export default Block;
