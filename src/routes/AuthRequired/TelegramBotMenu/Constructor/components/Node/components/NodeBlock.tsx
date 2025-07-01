import React, { forwardRef, HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import cn from 'utils/cn';

export const nodeBlockVariants = cva(
  ['w-full', 'border', 'border-outline', 'rounded-md', 'px-2.5', 'py-1.5'],
  {
    variants: {
      variant: {
        white: ['bg-white', 'text-foreground'],
        dark: ['bg-dark', 'text-dark-foreground'],
      },
    },
    defaultVariants: {
      variant: 'white',
    },
  },
);

export interface NodeBlockProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof nodeBlockVariants> {}

const NodeBlock = forwardRef<HTMLDivElement, NodeBlockProps>(
  ({ variant, className, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={cn(nodeBlockVariants({ variant, className }))}
      />
    );
  },
);
NodeBlock.displayName = 'NodeBlock';

export default NodeBlock;
