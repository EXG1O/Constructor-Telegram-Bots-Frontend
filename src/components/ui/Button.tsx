import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';

import cn from 'utils/cn';

export const buttonVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'transition',
    'cursor-pointer',
    'focus-visible:outline-none',
    'focus-visible:ring-4',
    'disabled:pointer-events-none',
    'disabled:opacity-65',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        light: [
          'bg-light',
          'text-light-foreground',
          'hover:bg-light-accent',
          'focus-visible:bg-light-accent',
          'focus-visible:ring-light/50',
        ],
        dark: [
          'bg-dark',
          'text-dark-foreground',
          'hover:bg-dark-accent',
          'focus-visible:bg-dark-accent',
          'focus-visible:ring-dark/50',
        ],
        secondary: [
          'bg-secondary',
          'text-secondary-foreground',
          'hover:bg-secondary-accent',
          'focus-visible:bg-secondary-accent',
          'focus-visible:ring-secondary/50',
        ],
        primary: [
          'bg-primary',
          'text-primary-foreground',
          'hover:bg-primary-accent',
          'focus-visible:bg-primary-accent',
          'focus-visible:ring-primary/50',
        ],
        danger: [
          'bg-danger',
          'text-danger-foreground',
          'hover:bg-danger-accent',
          'focus-visible:bg-danger-accent',
          'focus-visible:ring-danger/50',
        ],
        success: [
          'bg-success',
          'text-success-foreground',
          'hover:bg-success-accent',
          'focus-visible:bg-success-accent',
          'focus-visible:ring-success/50',
        ],
      },
      size: {
        sm: ['gap-1.5', 'text-sm', 'rounded-sm', 'px-2', 'py-1', '[&_svg]:size-3.5'],
        md: ['gap-2', 'text-base', 'rounded-md', 'px-3', 'py-1.5', '[&_svg]:size-4'],
        lg: ['gap-2.5', 'text-xl', 'rounded-lg', 'px-4', 'py-2', '[&_svg]:size-5'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, type = 'button', variant, size, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'button';

    return (
      <Component
        {...props}
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
      />
    );
  },
);
Button.displayName = 'Button';

export default Button;
