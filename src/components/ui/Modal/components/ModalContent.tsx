import React, { forwardRef } from 'react';
import {
  DialogContent,
  DialogContentProps,
  DialogOverlay,
  DialogPortal,
} from '@radix-ui/react-dialog';
import Z_INDEX from 'tokens/z-index';

import Spinner from 'components/ui/Spinner';

import useModal from '../hooks/useModal';

import cn from 'utils/cn';

export interface ModalContentProps
  extends Omit<DialogContentProps, 'asChild' | 'aria-describedby'> {}

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, children, onAnimationEnd, ...props }, ref) => {
    const { loading, onShowed, onHidden } = useModal();

    function handleAnimationEnd(event: React.AnimationEvent<HTMLDivElement>): void {
      onAnimationEnd?.(event);

      const state = event.currentTarget.dataset.state as 'open' | 'closed' | undefined;

      if (state) {
        (state === 'open' ? onShowed : onHidden)?.();
      }
    }

    return (
      <DialogPortal>
        <DialogOverlay
          className={cn(
            'fixed',
            Z_INDEX.MODAL,
            'inset-0',
            'bg-black/50',
            'overflow-x-hidden',
            'overflow-y-auto',
            'duration-300',
            'data-[state=open]:animate-in',
            'data-[state=closed]:animate-out',
            'data-[state=open]:fade-in',
            'data-[state=closed]:fade-out',
          )}
        >
          <DialogContent
            {...props}
            ref={ref}
            aria-describedby={undefined}
            className={cn(
              'flex',
              'flex-col',
              'w-auto',
              'sm:max-w-[500px]',
              'bg-background',
              'rounded-lg',
              'gap-4',
              'p-4',
              'sm:mx-auto',
              'm-2',
              'sm:my-7',
              'outline-0',
              'duration-300',
              'data-[state=open]:animate-in',
              'data-[state=closed]:animate-out',
              'data-[state=open]:slide-in-from-top-5',
              'data-[state=closed]:slide-out-to-top-5',
              className,
            )}
            onAnimationEnd={handleAnimationEnd}
          >
            {children}
            {loading && <Spinner className='self-center' />}
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    );
  },
);
ModalContent.displayName = 'ModalContent';

export default ModalContent;
