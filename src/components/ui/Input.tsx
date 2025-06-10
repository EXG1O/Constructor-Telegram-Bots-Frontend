import React from 'react';
import { forwardRef, InputHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';

import cn from 'utils/cn';

export const inputVariants = cva(
  [
    'block',
    'w-full',
    'bg-background',
    'text-foreground',
    'border',
    'appearance-none',
    'transition',
    'placeholder:text-muted',
    'focus:outline-none',
    'focus:ring-4',
    'disabled:bg-gray-200',
  ],
  {
    variants: {
      size: {
        sm: ['text-sm', 'rounded-sm', 'px-2', 'py-1'],
        md: ['text-base', 'rounded-md', 'px-3', 'py-1.5'],
        lg: ['text-lg', 'rounded-lg', 'px-4', 'py-2'],
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

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  asChild?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ asChild, size, invalid, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'input';

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(inputVariants({ size, invalid, className }))}
      />
    );
  },
);
Input.displayName = 'Input';

export default Input;
