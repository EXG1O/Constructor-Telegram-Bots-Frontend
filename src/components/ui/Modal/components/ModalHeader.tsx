import React, { forwardRef, HTMLAttributes } from 'react';
import { Close } from '@radix-ui/react-dialog';
import { Slot } from '@radix-ui/react-slot';

import CloseButton from 'components/shared/CloseButton';

import cn from 'utils/cn';

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  closeButton?: boolean;
}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ asChild, closeButton, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        className={cn('flex', 'justify-between', className)}
      >
        {children}
        {closeButton && (
          <Close asChild>
            <CloseButton />
          </Close>
        )}
      </Component>
    );
  },
);
ModalHeader.displayName = 'ModalHeader';

export default ModalHeader;
