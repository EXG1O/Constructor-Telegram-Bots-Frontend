import React, { forwardRef, useContext } from 'react';

import BaseOffcanvasBody, {
  OffcanvasBodyProps as BaseOffcanvasBodyProps,
} from 'react-bootstrap/OffcanvasBody';

import OffcanvasContext from '../contexts/OffcanvasContext';

import { FCA } from 'utils/helpers';

export type BodyOffcanvasProps = BaseOffcanvasBodyProps;

BaseOffcanvasBody.displayName = 'BaseOffcanvasBody';

const OffcanvasBody: FCA<'div', BodyOffcanvasProps> = forwardRef<
  HTMLElement,
  BodyOffcanvasProps
>(function OffcanvasBody(props, ref) {
  const context = useContext(OffcanvasContext);

  return !context?.loading && <BaseOffcanvasBody ref={ref} {...props} />;
});

export default OffcanvasBody;
