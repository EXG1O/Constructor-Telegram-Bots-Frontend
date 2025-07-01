import React, { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import useRichInputStore from '../../../hooks/useRichInputStore';

import cn from 'utils/cn';

export const toolbarGroupVariants = cva(['inline-flex'], {
  variants: {
    size: {
      sm: ['gap-2.25'],
      md: ['gap-2.5'],
      lg: ['gap-2.75'],
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface ToolbarGroupProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ToolbarGroup = forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    const size = useRichInputStore((state) => state.size);

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(toolbarGroupVariants({ size, className }))}
      />
    );
  },
);
ToolbarGroup.displayName = 'ToolbarGroup';

export default ToolbarGroup;
