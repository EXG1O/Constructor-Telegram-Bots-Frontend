import React, { HTMLAttributes } from 'react';
import { forwardRef, InputHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';

import cn from 'utils/cn';

import('./Check.css');

export const checkVariants = cva(
  [
    'check',
    'float-left',
    'h-4',
    'bg-background',
    'bg-no-repeat',
    'bg-center',
    'bg-contain',
    'border',
    'mt-1',
    'select-none',
    'cursor-pointer',
    'appearance-none',
    'focus:outline-none',
    'focus:ring-4',
    'checked:bg-primary',
    'checked:!border-primary',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
  ],
  {
    variants: {
      type: {
        checkbox: ['checkbox', 'w-4', 'rounded-sm', '-ml-6', 'transition'],
        switch: [
          'switch',
          'w-8',
          'bg-left',
          'rounded-4xl',
          '-ml-10',
          'transition-[background-position,box-shadow]',
          'checked:bg-right',
        ],
      },
      invalid: {
        false: ['border-outline', 'focus:border-outline-focus', 'focus:ring-focus'],
        true: ['border-danger', 'focus:ring-danger/25'],
      },
    },
    defaultVariants: {
      type: 'checkbox',
      invalid: false,
    },
  },
);

const wrapperVariants = cva(['block', 'w-full', 'min-h-4'], {
  variants: {
    type: {
      checkbox: ['pl-6'],
      switch: ['pl-10'],
    },
  },
});

export interface CheckProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>,
    VariantProps<typeof checkVariants> {
  asChild?: boolean;
  label?: string | number;
  wrapperProps?: Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
}

const Check = forwardRef<HTMLInputElement, CheckProps>(
  ({ asChild, label, type, invalid, className, wrapperProps, ...props }, ref) => {
    const Component = asChild ? Slot : 'input';

    return (
      <div
        {...wrapperProps}
        className={cn(wrapperVariants({ type, className: wrapperProps?.className }))}
      >
        <Component
          {...props}
          ref={ref}
          type='checkbox'
          className={cn(checkVariants({ type, invalid, className }))}
        />
        {label && (
          <label className={cn('text-foreground', invalid && 'text-danger')}>
            {label}
          </label>
        )}
      </div>
    );
  },
);
Check.displayName = 'Check';

export default Check;
