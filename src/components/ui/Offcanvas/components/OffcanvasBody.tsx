import React, { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';

import useOffcanvas from '../hooks/useOffcanvas';

import cn from 'utils/cn';

export interface OffcanvasBodyProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const OffcanvasBody = forwardRef<HTMLDivElement, OffcanvasBodyProps>(
  ({ asChild, className, ...props }, ref) => {
    const { loading } = useOffcanvas();

    const Component = asChild ? Slot : 'div';

    return (
      !loading && (
        <Component
          ref={ref}
          {...props}
          className={cn(
            'flex-auto',
            'overflow-x-hidden',
            'overflow-y-auto',
            'px-4',
            className,
          )}
        />
      )
    );
  },
);
OffcanvasBody.displayName = 'OffcanvasBody';

export default OffcanvasBody;
