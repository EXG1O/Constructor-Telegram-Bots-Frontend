import React, { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';

import useModal from '../hooks/useModal';

import cn from 'utils/cn';

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ asChild, className, ...props }, ref) => {
    const { loading } = useModal();

    const Component = asChild ? Slot : 'div';

    return (
      !loading && (
        <Component ref={ref} {...props} className={cn('flex-auto', className)} />
      )
    );
  },
);
ModalBody.displayName = 'ModalBody';

export default ModalBody;
