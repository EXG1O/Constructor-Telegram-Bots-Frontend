import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { CardBodyProps } from 'react-bootstrap/CardBody';

import Card from 'components/ui/Card';

import { FCA } from 'utils/helpers';

export type BlockBodyProps = CardBodyProps;

const BlockBody: FCA<'div', BlockBodyProps> = forwardRef<HTMLDivElement, BlockBodyProps>(
  function BlockBody({ className, ...props }, ref) {
    return <Card.Body ref={ref} {...props} className={classNames(className, 'p-2')} />;
  },
);

export default BlockBody;
