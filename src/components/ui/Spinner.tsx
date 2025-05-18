import React, { forwardRef, HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import cn from 'utils/cn';

export const spinnerVariants = cva(
  [
    'inline-block',
    'rounded-full',
    'border-current',
    'border-r-transparent',
    'animate-spin',
  ],
  {
    variants: {
      size: {
        xxs: ['w-5', 'h-5', 'border-2'],
        xs: ['w-7', 'h-7', 'border-[2.4px]'],
        sm: ['w-10', 'h-10', 'border-[3.2px]'],
        md: ['w-15', 'h-15', 'border-4'],
        lg: ['w-20', 'h-20', 'border-[4.8px]'],
        xl: ['w-25', 'h-25', 'border-[5.6px]'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type SpinnerProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof spinnerVariants>;

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size, className, ...props }, ref) => {
    return (
      <div {...props} ref={ref} className={cn(spinnerVariants({ size, className }))} />
    );
  },
);
Spinner.displayName = 'Spinner';

export default Spinner;
