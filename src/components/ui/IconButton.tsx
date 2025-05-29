import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';

import cn from 'utils/cn';

export const iconButtonVariants = cva(
  [
    'inline-block',
    'transition',
    'cursor-pointer',
    'focus-visible:outline-none',
    'focus-visible:ring-4',
    'focus-visible:ring-focus',
    'disabled:pointer-events-none',
    'disabled:opacity-65',
  ],
  {
    variants: {
      size: {
        xs: ['rounded-xs', '[&_svg]:size-3.5'],
        sm: ['rounded-xs', '[&_svg]:size-4'],
        md: ['rounded-xs', '[&_svg]:size-4.5'],
        lg: ['rounded-sm', '[&_svg]:size-5'],
        xl: ['rounded-sm', '[&_svg]:size-6'],
        '2xl': ['rounded-sm', '[&_svg]:size-7'],
        '3xl': ['rounded-md', '[&_svg]:size-8'],
        '4xl': ['rounded-md', '[&_svg]:size-9'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  asChild?: boolean;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ asChild, type = 'button', size, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'button';

    return (
      <Component
        {...props}
        ref={ref}
        type={type}
        className={cn(iconButtonVariants({ size, className }))}
      />
    );
  },
);
IconButton.displayName = 'IconButton';

export default IconButton;
