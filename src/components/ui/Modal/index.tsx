import React, { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@radix-ui/react-dialog';
import Z_INDEX from 'tokens/z-index';

import Spinner from 'components/ui/Spinner';

import ModalBody from './components/ModalBody';
import ModalFooter from './components/ModalFooter';
import ModalHeader from './components/ModalHeader';
import ModalTitle from './components/ModalTitle';
import ModalContext, { ModalContextProps } from './contexts/ModalContext';

import cn from 'utils/cn';

export interface ModalProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'aria-describedby'>,
    Partial<ModalContextProps> {
  show?: boolean;
  onShow?: () => void;
  onShowed?: () => void;
  onHide?: () => void;
  onHidden?: () => void;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      show,
      loading,
      className,
      children,
      onShow,
      onShowed,
      onHide,
      onHidden,
      onAnimationEnd,
      ...props
    },
    ref,
  ) => {
    function handleOpenChange(open: boolean): void {
      (open ? onShow : onHide)?.();
    }

    function handleAnimationEnd(event: React.AnimationEvent<HTMLDivElement>): void {
      onAnimationEnd?.(event);

      const state = event.currentTarget.dataset.state as 'open' | 'closed' | undefined;

      if (state) {
        (state === 'open' ? onShowed : onHidden)?.();
      }
    }

    return (
      <Dialog open={show} onOpenChange={handleOpenChange}>
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
              <ModalContext.Provider value={{ loading: Boolean(loading) }}>
                {children}
                {loading && <Spinner className='self-center' />}
              </ModalContext.Provider>
            </DialogContent>
          </DialogOverlay>
        </DialogPortal>
      </Dialog>
    );
  },
);
Modal.displayName = 'Modal';

export default Object.assign(Modal, {
  Header: ModalHeader,
  Title: ModalTitle,
  Body: ModalBody,
  Footer: ModalFooter,
});
