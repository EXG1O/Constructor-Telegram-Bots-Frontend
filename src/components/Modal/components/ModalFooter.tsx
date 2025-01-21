import React, { forwardRef, useContext } from 'react';

import BaseModalFooter, {
  ModalFooterProps as BaseModalFooterProps,
} from 'react-bootstrap/ModalFooter';

import ModalContext from '../contexts/ModalContext';

import { FCA } from 'utils/helpers';

export interface ModalFooterProps extends BaseModalFooterProps {
  as?: any;
}

BaseModalFooter.displayName = 'BaseModalFooter';

const ModalFooter: FCA<'div', ModalFooterProps> = forwardRef<
  HTMLElement,
  ModalFooterProps
>(function ModalFooter(props, ref) {
  const context = useContext(ModalContext);

  return !context?.loading && <BaseModalFooter ref={ref} {...props} />;
});

export default ModalFooter;
