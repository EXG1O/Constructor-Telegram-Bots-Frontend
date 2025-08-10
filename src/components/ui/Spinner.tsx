import React, { forwardRef, HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import cn from 'utils/cn';

export const spinnerVariants = cva(
  [
    'inline-block',
    'border-dark',
    'border-r-transparent',
    'rounded-full',
    'animate-spin',
  ],
  {
    variants: {
      size: {
        '3xs': ['size-4', 'border-[1.2px]'],
        '2xs': ['size-5', 'border-2'],
        xs: ['size-6', 'border-[2.4px]'],
        sm: ['size-8', 'border-[3.2px]'],
        md: ['size-10', 'border-4'],
        lg: ['size-12', 'border-[4.8px]'],
        xl: ['size-14', 'border-[5.6px]'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface SpinnerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size, className, ...props }, ref) => {
    return (
      <div {...props} ref={ref} className={cn(spinnerVariants({ size, className }))} />
    );
  },
);
Spinner.displayName = 'Spinner';

export default Spinner;
