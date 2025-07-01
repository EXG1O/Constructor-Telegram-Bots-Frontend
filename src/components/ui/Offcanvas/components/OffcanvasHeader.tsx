import React, { forwardRef, HTMLAttributes } from 'react';
import { Close } from '@radix-ui/react-dialog';
import { Slot } from '@radix-ui/react-slot';

import CloseButton from 'components/shared/CloseButton';

import cn from 'utils/cn';

export interface OffcanvasHeaderProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  closeButton?: boolean;
}

const OffcanvasHeader = forwardRef<HTMLDivElement, OffcanvasHeaderProps>(
  ({ asChild, closeButton, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        className={cn('flex', 'justify-between', 'p-4', className)}
      >
        {children}
        {closeButton && (
          <Close asChild>
            <CloseButton className='text-foreground' />
          </Close>
        )}
      </Component>
    );
  },
);
OffcanvasHeader.displayName = 'OffcanvasHeader';

export default OffcanvasHeader;
