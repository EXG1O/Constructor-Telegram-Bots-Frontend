import React, { useEffect, useRef, useState } from 'react';
import { forwardRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentProps,
  DialogOverlay,
  DialogPortal,
} from '@radix-ui/react-dialog';

import Spinner from 'components/ui/Spinner';

import ModalBody from './components/ModalBody';
import ModalFooter from './components/ModalFooter';
import ModalHeader from './components/ModalHeader';
import ModalTitle from './components/ModalTitle';
import ModalContext, { ModalContextProps } from './contexts/ModalContext';

import cn from 'utils/cn';

export interface ModalProps extends DialogContentProps, Partial<ModalContextProps> {
  show?: boolean;
  onShow?: () => void;
  onHide?: () => void;
  onHidden?: () => void;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    { show = false, loading, className, children, onShow, onHide, onHidden, ...props },
    ref,
  ) => {
    const [open, setOpen] = useState<boolean>(show);
    const [close, setClose] = useState<boolean>(!open);

    const prevOpenStateRef = useRef<boolean>(!open);

    useEffect(() => setOpen(show), [show]);
    useEffect(() => {
      prevOpenStateRef.current = !open;
      const prevOpenState = prevOpenStateRef.current;

      if (open && !prevOpenState) {
        setClose(false);
        onShow?.();
      }

      if (!open && prevOpenState) {
        onHide?.();

        const timeoutId: NodeJS.Timeout = setTimeout(handleHidden, 300);
        return () => clearTimeout(timeoutId);
      }
    }, [open]);

    function handleHidden(): void {
      onHidden?.();
      setClose(true);
    }

    function handleOpenChange(newOpen: boolean): void {
      setOpen(newOpen);
    }

    return (
      <Dialog open={open && !close} onOpenChange={handleOpenChange}>
        <DialogPortal>
          <DialogOverlay
            className={cn(
              'fixed',
              'inset-0',
              'bg-black/50',
              'overflow-x-hidden',
              'overflow-y-auto',
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
                'text-foreground',
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
