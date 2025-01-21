import React, { forwardRef, useContext } from 'react';

import BaseModalBody, {
  ModalBodyProps as BaseModalBodyProps,
} from 'react-bootstrap/ModalBody';

import ModalContext from '../contexts/ModalContext';

import { FCA } from 'utils/helpers';

export type ModalBodyProps = BaseModalBodyProps;

BaseModalBody.displayName = 'BaseModalBody';

const ModalBody: FCA<'div', ModalBodyProps> = forwardRef<HTMLElement, ModalBodyProps>(
  function ModalBody(props, ref) {
    const context = useContext(ModalContext);

    return !context?.loading && <BaseModalBody ref={ref} {...props} />;
  },
);

export default ModalBody;
