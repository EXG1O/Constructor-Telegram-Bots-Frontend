import React, { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';

import useOffcanvas from '../hooks/useOffcanvas';

import cn from 'utils/cn';

export interface OffcanvasFooterProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const OffcanvasFooter = forwardRef<HTMLDivElement, OffcanvasFooterProps>(
  ({ asChild, className, ...props }, ref) => {
    const { loading } = useOffcanvas();

    const Component = asChild ? Slot : 'div';

    return (
      !loading && <Component {...props} ref={ref} className={cn('p-4', className)} />
    );
  },
);
OffcanvasFooter.displayName = 'OffcanvasFooter';

export default OffcanvasFooter;
