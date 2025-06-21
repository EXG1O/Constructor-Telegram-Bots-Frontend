import React, { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';

import cn from 'utils/cn';

export const blockVariants = cva(['block', 'w-full'], {
  variants: {
    variant: {
      light: ['bg-light', 'text-light-foreground'],
      dark: ['bg-dark', 'text-dark-foreground'],
      primary: ['bg-primary', 'text-primary-foreground'],
    },
    gradient: {
      true: 'bg-gradient-to-r',
    },
    size: {
      sm: ['rounded-md', 'p-1'],
      md: ['rounded-lg', 'p-2'],
      lg: ['rounded-xl', 'p-2.5'],
      xl: ['rounded-2xl', 'p-3'],
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
    size: 'md',
  },
});

export interface BlockProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof blockVariants> {
  asChild?: boolean;
}

const Block = forwardRef<HTMLDivElement, BlockProps>(
  ({ asChild, size, variant, gradient, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(blockVariants({ size, variant, gradient, className }))}
      />
    );
  },
);
Block.displayName = 'Block';

export default Block;
