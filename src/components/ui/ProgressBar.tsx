import React, { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';

import cn from 'utils/cn';

export interface ProgressBarProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'aria-valuenow' | 'aria-valuemin' | 'aria-valuemax'
  > {
  asChild?: boolean;
  now: number;
  min?: number;
  max: number;
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ asChild, now, min = 0, max, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        aria-valuenow={now}
        aria-valuemin={min}
        aria-valuemax={max}
        className={cn(
          'w-full',
          'h-3',
          'overflow-hidden',
          'rounded-sm',
          'bg-gray-200',
          className,
        )}
      >
        <div
          className='h-full bg-dark'
          style={{ width: `${((now - min) / (max - min)) * 100}%` }}
        />
      </Component>
    );
  },
);
ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
