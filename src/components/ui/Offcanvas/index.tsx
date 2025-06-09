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

import OffcanvasBody from './components/OffcanvasBody';
import OffcanvasFooter from './components/OffcanvasFooter';
import OffcanvasHeader from './components/OffcanvasHeader';
import OffcanvasTitle from './components/OffcanvasTitle';
import OffcanvasContext, { OffcanvasContextProps } from './contexts/OffcanvasContext';

import cn from 'utils/cn';

export interface OffcanvasProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'aria-describedby'>,
    Partial<OffcanvasContextProps> {
  show?: boolean;
  onShow?: () => void;
  onShowed?: () => void;
  onHide?: () => void;
  onHidden?: () => void;
}

const Offcanvas = forwardRef<HTMLDivElement, OffcanvasProps>(
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
              'inset-0',
              Z_INDEX.OFFCANVAS,
              'bg-black/50',
              'duration-300',
              'data-[state=open]:animate-in',
              'data-[state=closed]:animate-out',
              'data-[state=open]:fade-in',
              'data-[state=closed]:fade-out',
            )}
          />
          <DialogContent
            {...props}
            ref={ref}
            aria-describedby={undefined}
            className={cn(
              'fixed',
              'inset-y-0',
              'left-0',
              Z_INDEX.OFFCANVAS,
              'flex',
              'flex-col',
              'size-full',
              'max-w-[420px]',
              'bg-background',
              'outline-0',
              'duration-300',
              'data-[state=open]:animate-in',
              'data-[state=closed]:animate-out',
              'data-[state=open]:slide-in-from-left',
              'data-[state=closed]:slide-out-to-left',
              className,
            )}
            onAnimationEnd={handleAnimationEnd}
          >
            <OffcanvasContext.Provider value={{ loading: Boolean(loading) }}>
              {children}
              {loading && (
                <div className='flex flex-auto items-center justify-center'>
                  <Spinner />
                </div>
              )}
            </OffcanvasContext.Provider>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );
  },
);
Offcanvas.displayName = 'Offcanvas';

export default Object.assign(Offcanvas, {
  Header: OffcanvasHeader,
  Title: OffcanvasTitle,
  Body: OffcanvasBody,
  Footer: OffcanvasFooter,
});
