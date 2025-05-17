import React, { forwardRef, HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import cn from 'utils/cn';
import { AsProp, FCA } from 'utils/helpers';

export const blockVariants = cva(['rounded-2xl p-3'], {
  variants: {
    variant: {
      light: ['bg-light', 'text-light-foreground'],
      dark: ['bg-dark', 'text-dark-foreground'],
      primary: ['bg-primary', 'text-primary-foreground'],
    },
    gradient: {
      false: null,
      true: 'bg-gradient-to-r',
    },
  },
  compoundVariants: [
    {
      variant: 'dark',
      gradient: true,
      className: 'from-dark to-dark/80',
    },
    {
      variant: 'primary',
      gradient: true,
      className: 'from-primary to-primary/80',
    },
  ],
  defaultVariants: {
    variant: 'light',
  },
});

export type BlockProps = AsProp &
  HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof blockVariants>;

const Block: FCA<'div', BlockProps> = forwardRef<HTMLElement, BlockProps>(
  function Block(
    { as: Component = 'div', variant, gradient, className, ...props },
    ref,
  ) {
    return (
      <Component
        {...props}
        ref={ref}
        className={cn(blockVariants({ variant, gradient, className }))}
      />
    );
  },
);

export default Block;
