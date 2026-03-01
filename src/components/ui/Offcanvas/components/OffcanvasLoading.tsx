import React, { forwardRef, HTMLAttributes } from 'react';

import Spinner from 'components/ui/Spinner';

import cn from 'utils/cn';

export interface OffcanvasLoadingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

const OffcanvasLoading = forwardRef<HTMLDivElement, OffcanvasLoadingProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        {...props}
        ref={ref}
        className={cn('flex', 'flex-auto', 'items-center', 'justify-center', className)}
      >
        <Spinner />
      </div>
    );
  },
);
OffcanvasLoading.displayName = 'OffcanvasLoading';

export default OffcanvasLoading;
