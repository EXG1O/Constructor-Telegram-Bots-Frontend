import React, { type HTMLAttributes } from 'react';
import { forwardRef, type InputHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import cn from 'utils/cn';

const wrapperVariants = cva(['w-full', 'flex', 'items-center'], {
  variants: {
    size: {
      sm: ['gap-1.5'],
      md: ['gap-2'],
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const checkVariants = cva(
  [
    'check',
    'float-left',
    'bg-background',
    'bg-no-repeat',
    'bg-contain',
    'border',
    'select-none',
    'cursor-pointer',
    'appearance-none',
    'focus:outline-none',
    'focus:ring-4',
    'checked:bg-primary',
    'checked:border-primary!',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
  ],
  {
    variants: {
      type: {
        checkbox: [
          'bg-center',
          'rounded-sm',
          'transition',
          'checked:bg-[url(data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%2020%2020%22%3E%3Cpath%20fill=%22none%22%20stroke=%22%23fff%22%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%20stroke-width=%223%22%20d=%22m6%2010%203%203%206-6%22/%3E%3C/svg%3E)]',
        ],
        switch: [
          'bg-[url(data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%22-4%20-4%208%208%22%3E%3Ccircle%20r=%223%22%20fill=%22rgba%280%2C0%2C0%2C0.25%29%22/%3E%3C/svg%3E)]',
          'bg-left',
          'rounded-4xl',
          'transition-[background-position,box-shadow]',
          'focus:not-checked:bg-[url(data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%22-4%20-4%208%208%22%3E%3Ccircle%20r=%223%22%20fill=%22%2380ccf5%22/%3E%3C/svg%3E)]',
          'checked:bg-right',
          'checked:bg-[url(data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%22-4%20-4%208%208%22%3E%3Ccircle%20r=%223%22%20fill=%22%23fff%22/%3E%3C/svg%3E)]',
        ],
      },
      size: {
        sm: ['h-3.5'],
        md: ['h-4'],
      },
      invalid: {
        false: ['border-outline', 'focus:border-outline-focus', 'focus:ring-focus'],
        true: ['border-danger', 'focus:ring-danger/25'],
      },
    },
    compoundVariants: [
      { type: 'checkbox', size: 'sm', className: ['w-3.5'] },
      { type: 'checkbox', size: 'md', className: ['w-4'] },
      { type: 'switch', size: 'sm', className: ['w-7'] },
      { type: 'switch', size: 'md', className: ['w-8'] },
    ],
    defaultVariants: {
      type: 'checkbox',
      size: 'md',
      invalid: false,
    },
  },
);

const labelVariants = cva([], {
  variants: {
    size: {
      sm: ['text-sm'],
      md: ['text-base'],
    },
    invalid: {
      false: ['text-foreground'],
      true: ['text-danger'],
    },
  },
  defaultVariants: {
    size: 'md',
    invalid: false,
  },
});

export interface CheckProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>,
    VariantProps<typeof checkVariants> {
  asChild?: boolean;
  label?: string | number;
  wrapperProps?: Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
}

const Check = forwardRef<HTMLInputElement, CheckProps>(
  ({ asChild, label, type, size, invalid, className, wrapperProps, ...props }, ref) => {
    const Component = asChild ? Slot : 'input';

    return (
      <div
        {...wrapperProps}
        className={cn(wrapperVariants({ size, className: wrapperProps?.className }))}
      >
        <Component
          {...props}
          ref={ref}
          type='checkbox'
          className={cn(checkVariants({ type, size, invalid, className }))}
        />
        {label && <label className={labelVariants({ size, invalid })}>{label}</label>}
      </div>
    );
  },
);
Check.displayName = 'Check';

export default Check;
