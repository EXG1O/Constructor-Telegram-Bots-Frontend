import React, { ReactElement, useMemo } from 'react';
import { Dialog, DialogProps } from '@radix-ui/react-dialog';

import ModalBody from './components/ModalBody';
import ModalContent from './components/ModalContent';
import ModalFooter from './components/ModalFooter';
import ModalHeader from './components/ModalHeader';
import ModalTitle from './components/ModalTitle';
import ModalTrigger from './components/ModalTrigger';
import ModalContext, { ModalContextProps } from './contexts/ModalContext';

export interface ModalProps
  extends Pick<DialogProps, 'modal' | 'children'>,
    Partial<ModalContextProps> {
  show?: boolean;
}

function Modal({
  show,
  loading,
  children,
  onShow,
  onShowed,
  onHide,
  onHidden,
  ...props
}: ModalProps): ReactElement {
  const contextValue = useMemo<ModalContextProps>(
    () => ({ loading: Boolean(loading), onShow, onShowed, onHide, onHidden }),
    [loading, onShow, onShowed, onHide, onHidden],
  );

  function handleOpenChange(open: boolean): void {
    (open ? onShow : onHide)?.();
  }

  return (
    <Dialog {...props} open={show} onOpenChange={handleOpenChange}>
      <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>
    </Dialog>
  );
}

export default Object.assign(Modal, {
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: ModalHeader,
  Title: ModalTitle,
  Body: ModalBody,
  Footer: ModalFooter,
});
