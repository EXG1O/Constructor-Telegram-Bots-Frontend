import React, { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { DEFAULT_SIZE } from '..';

import useSimpleInputStore from '../hooks/useSimpleInputStore';

import cn from 'utils/cn';

export const simpleInputContainerVariants = cva(
  [
    'flex',
    'flex-col',
    'w-full',
    'bg-background',
    'border',
    'transition',
    'focus-within:ring-4',
  ],
  {
    variants: {
      size: {
        sm: ['rounded-sm'],
        md: ['rounded-md'],
        lg: ['rounded-lg'],
      },
      invalid: {
        false: [
          'border-outline',
          'focus-within:border-outline-focus',
          'focus-within:ring-focus',
        ],
        true: ['border-danger', 'focus-within:ring-danger/25'],
      },
    },
    defaultVariants: {
      size: DEFAULT_SIZE,
      invalid: false,
    },
  },
);

export interface SimpleInputContainerProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const SimpleInputContainer = forwardRef<HTMLDivElement, SimpleInputContainerProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    const size = useSimpleInputStore((state) => state.size);
    const invalid = useSimpleInputStore((state) => state.invalid);

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(simpleInputContainerVariants({ size, invalid, className }))}
      />
    );
  },
);
SimpleInputContainer.displayName = 'SimpleInputContainer';

export default SimpleInputContainer;
