import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import ProgressBar, { type ProgressBarProps } from 'components/ui/ProgressBar';

import cn from 'utils/cn';
import formatMB from 'utils/formatMB';

export const storageProgressBarVariants = cva(
  ['flex', 'w-full', 'items-center', 'gap-2', 'text-nowrap'],
  {
    variants: {
      size: {
        sm: ['text-sm'],
        md: ['text-base'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface StorageProgressBarProps
  extends
    Omit<ProgressBarProps, 'now' | 'min' | 'max'>,
    VariantProps<typeof storageProgressBarVariants> {
  storageSize: number;
  usedStorageSize: number;
}

const StorageProgressBar = forwardRef<HTMLDivElement, StorageProgressBarProps>(
  ({ asChild, size, storageSize, usedStorageSize, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(storageProgressBarVariants({ size, className }))}
      >
        <span>{formatMB(usedStorageSize)}</span>
        <ProgressBar now={usedStorageSize} max={storageSize} className='flex-auto' />
        <span>{formatMB(storageSize)}</span>
      </Component>
    );
  },
);
StorageProgressBar.displayName = 'StorageProgressBar';

export default StorageProgressBar;
