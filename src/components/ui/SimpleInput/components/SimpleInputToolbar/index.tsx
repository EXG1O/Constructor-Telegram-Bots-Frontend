import React, { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import ToolbarButton from './components/ToolbarButton';

import useSimpleInputStore from '../../hooks/useSimpleInputStore';

import cn from 'utils/cn';

import { DEFAULT_SIZE } from '../..';

export const codeInputToolbarVariants = cva(
  ['flex', 'w-full', 'border-b', 'border-b-outline'],
  {
    variants: {
      size: {
        sm: ['gap-4.5', 'px-2.5', 'py-1'],
        md: ['gap-5.5', 'px-3', 'py-1.5'],
        lg: ['gap-6.5', 'px-3.5', 'py-2'],
      },
    },
    defaultVariants: {
      size: DEFAULT_SIZE,
    },
  },
);

export interface SimpleInputToolbarProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const SimpleInputToolbar = forwardRef<HTMLDivElement, SimpleInputToolbarProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    const size = useSimpleInputStore((store) => store.size);

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(codeInputToolbarVariants({ size, className }))}
      />
    );
  },
);
SimpleInputToolbar.displayName = 'SimpleInputToolbar';

export default Object.assign(SimpleInputToolbar, { Button: ToolbarButton });
