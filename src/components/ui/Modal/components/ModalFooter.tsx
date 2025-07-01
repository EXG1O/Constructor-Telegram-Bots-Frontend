import React, { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';

import useModal from '../hooks/useModal';

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ asChild, ...props }, ref) => {
    const { loading } = useModal();

    const Component = asChild ? Slot : 'div';

    return !loading && <Component {...props} ref={ref} />;
  },
);
ModalFooter.displayName = 'ModalFooter';

export default ModalFooter;
