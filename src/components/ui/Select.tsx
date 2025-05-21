import React, { SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';

import cn from 'utils/cn';

export const selectVariants = cva(
  [
    'block',
    'w-full',
    'border',
    'border-outline',
    'rounded-md',
    'cursor-pointer',
    'appearance-none',
    'transition-colors',
    'transition-shadow',
    'focus:outline-none',
    'focus:ring-4',
    'disabled:bg-gray-200',
  ],
  {
    variants: {
      size: {
        sm: ['text-sm', 'rounded-sm', 'pl-2', 'pr-8', 'py-1'],
        md: ['text-base', 'rounded-md', 'pl-3', 'pr-10', 'py-1.5'],
        lg: ['text-lg', 'rounded-lg', 'pl-4', 'pr-12', 'py-2'],
      },
      invalid: {
        false: ['border-outline', 'focus:border-outline-focus', 'focus:ring-focus'],
        true: ['border-danger', 'focus:ring-danger/25'],
      },
    },
    defaultVariants: {
      size: 'md',
      invalid: false,
    },
  },
);

const iconVariants = cva(
  ['absolute', 'top-1/2', '-translate-y-1/2', 'text-muted', 'pointer-events-none'],
  {
    variants: {
      size: {
        sm: ['size-4', 'right-2'],
        md: ['size-5', 'right-2.5'],
        lg: ['size-6', 'right-3'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  asChild?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ asChild, size, invalid, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'select';

    return (
      <div className='relative w-full'>
        <Component
          {...props}
          ref={ref}
          className={cn(selectVariants({ size, invalid, className }))}
        />
        <ChevronDown className={cn(iconVariants({ size }))} />
      </div>
    );
  },
);
Select.displayName = 'Select';

export default Select;
