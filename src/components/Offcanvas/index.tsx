import React, { forwardRef, ReactNode } from 'react';

import { BaseModalProps } from '@restart/ui/Modal';
import BaseOffcanvas from 'react-bootstrap/Offcanvas';

import OffcanvasBody from './components/OffcanvasBody';
import OffcanvasFooter from './components/OffcanvasFooter';
import OffcanvasHeader from './components/OffcanvasHeader';
import OffcanvasTitle from './components/OffcanvasTitle';
import OffcanvasContext from './contexts/OffcanvasContext';

import Spinner from 'components/ui/Spinner';

import('./index.scss');

export interface OffcanvasProps
  extends Omit<
    BaseModalProps,
    | 'role'
    | 'renderBackdrop'
    | 'renderDialog'
    | 'transition'
    | 'backdrop'
    | 'backdropTransition'
    | 'keyboard'
    | 'children'
  > {
  loading?: boolean;
  bsPrefix?: string;
  backdropClassName?: string;
  scroll?: boolean;
  placement?: 'start' | 'end' | 'top' | 'bottom';
  responsive?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  renderStaticNode?: boolean;
  children?: ReactNode;
}

BaseOffcanvas.displayName = 'BaseOffcanvas';

const Offcanvas = forwardRef<HTMLElement, OffcanvasProps>(function Offcanvas(
  { loading = false, children, ...props },
  ref,
) {
  return (
    <OffcanvasContext.Provider value={{ loading }}>
      <BaseOffcanvas ref={ref} {...props}>
        {children}
        {loading && (
          <BaseOffcanvas.Body className='d-flex justify-content-center'>
            <Spinner size='md' className='align-self-center' />
          </BaseOffcanvas.Body>
        )}
      </BaseOffcanvas>
    </OffcanvasContext.Provider>
  );
});

export default Object.assign(Offcanvas, {
  Header: OffcanvasHeader,
  Title: OffcanvasTitle,
  Body: OffcanvasBody,
  Footer: OffcanvasFooter,
});
