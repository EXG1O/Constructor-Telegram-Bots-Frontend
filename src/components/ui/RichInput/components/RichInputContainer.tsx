import React, { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import useRichInputStore from '../hooks/useRichInputStore';

import cn from 'utils/cn';

const richInputContainerVariants = cva(
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
      size: 'md',
      invalid: false,
    },
  },
);

export interface RichInputContainerProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const RichInputContainer = forwardRef<HTMLDivElement, RichInputContainerProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    const size = useRichInputStore((state) => state.size);
    const invalid = useRichInputStore((state) => state.invalid);

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(richInputContainerVariants({ size, invalid, className }))}
      />
    );
  },
);
RichInputContainer.displayName = 'RichInputContainer';

export default RichInputContainer;
