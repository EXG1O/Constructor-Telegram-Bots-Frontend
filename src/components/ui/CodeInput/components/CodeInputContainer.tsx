import React, { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { DEFAULT_SIZE } from '..';

import useCodeInputStore from '../hooks/useCodeInputStore';

import cn from 'utils/cn';

export const codeInputContainerVariants = cva(
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

export interface CodeInputContainerProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const CodeInputContainer = forwardRef<HTMLDivElement, CodeInputContainerProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    const size = useCodeInputStore((state) => state.size);
    const invalid = useCodeInputStore((state) => state.invalid);

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(codeInputContainerVariants({ size, invalid, className }))}
      />
    );
  },
);
CodeInputContainer.displayName = 'CodeInputContainer';

export default CodeInputContainer;
