import React, { forwardRef, ReactNode } from 'react';

import { BaseModalProps } from '@restart/ui/Modal';
import BaseModal from 'react-bootstrap/Modal';

import ModalBody from './components/ModalBody';
import ModalFooter from './components/ModalFooter';
import ModalHeader from './components/ModalHeader';
import ModalTitle from './components/ModalTitle';
import ModalContext from './contexts/ModalContext';

import Spinner from 'components/ui/Spinner';

import { FCA } from 'utils/helpers';

import('./index.scss');

export interface ModalProps
  extends Omit<
    BaseModalProps,
    | 'role'
    | 'transition'
    | 'backdropTransition'
    | 'renderBackdrop'
    | 'renderDialog'
    | 'children'
  > {
  loading?: boolean;
  size?: 'sm' | 'lg' | 'xl';
  fullscreen?: 'sm-down' | 'md-down' | 'lg-down' | 'xl-down' | 'xxl-down';
  animation?: boolean;
  centered?: boolean;
  backdropClassName?: string;
  dialogClassName?: string;
  contentClassName?: string;
  dialogAs?: React.ElementType;
  scrollable?: boolean;
  children?: ReactNode;
}

BaseModal.displayName = 'BaseModal';

const Modal: FCA<'div', ModalProps> = forwardRef<HTMLElement, ModalProps>(
  function Modal({ loading = false, backdrop, keyboard, children, ...props }, ref) {
    return (
      <ModalContext.Provider value={{ loading }}>
        <BaseModal
          ref={ref}
          {...props}
          backdrop={loading ? 'static' : backdrop}
          keyboard={!loading && keyboard}
        >
          {children}
          {loading && (
            <BaseModal.Body className='d-flex justify-content-center'>
              <Spinner size='md' />
            </BaseModal.Body>
          )}
        </BaseModal>
      </ModalContext.Provider>
    );
  },
);

export default Object.assign(Modal, {
  Header: ModalHeader,
  Title: ModalTitle,
  Body: ModalBody,
  Footer: ModalFooter,
});
