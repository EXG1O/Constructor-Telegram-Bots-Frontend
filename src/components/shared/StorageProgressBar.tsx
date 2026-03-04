import React, { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';

import ProgressBar, { ProgressBarProps } from 'components/ui/ProgressBar';

import cn from 'utils/cn';

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
        <span>{`${(usedStorageSize / 1024 ** 2).toFixed(2)} MB`}</span>
        <ProgressBar now={usedStorageSize} max={storageSize} className='flex-auto' />
        <span>{`${(storageSize / 1024 ** 2).toFixed(2)} MB`}</span>
      </Component>
    );
  },
);
StorageProgressBar.displayName = 'StorageProgressBar';

export default StorageProgressBar;
