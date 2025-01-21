import React, { forwardRef, useContext } from 'react';

import BaseOffcanvasHeader, {
  OffcanvasHeaderProps as BaseOffcanvasHeaderProps,
} from 'react-bootstrap/OffcanvasHeader';

import OffcanvasContext from '../contexts/OffcanvasContext';

export type OffcanvasHeaderProps = BaseOffcanvasHeaderProps;

BaseOffcanvasHeader.displayName = 'BaseOffcanvasHeader';

const OffcanvasHeader = forwardRef<HTMLDivElement, OffcanvasHeaderProps>(
  function OffcanvasHeader({ closeButton, ...props }, ref) {
    const context = useContext(OffcanvasContext);

    return (
      <BaseOffcanvasHeader
        ref={ref}
        {...props}
        closeButton={!context?.loading && closeButton}
      />
    );
  },
);

export default OffcanvasHeader;
