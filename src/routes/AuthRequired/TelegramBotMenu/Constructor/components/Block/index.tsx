import React, { forwardRef } from 'react';

import Card, { CardProps } from 'components/ui/Card';

import BlockBody from './components/BlockBody';
import BlockCollapse from './components/BlockCollapse';
import BlockFooter from './components/BlockFooter';

import { FCA } from 'utils/helpers';

export interface BlockProps extends CardProps {
  title: string;
  body?: boolean;
}

const Block: FCA<'div', BlockProps> = forwardRef<HTMLDivElement, BlockProps>(
  function Block({ title, body, children, ...props }, ref) {
    return (
      <Card ref={ref} {...props}>
        <Card.Header>
          {title}
        </Card.Header>
        {body ? <BlockBody>{children}</BlockBody> : children}
      </Card>
    );
  },
);

export default Object.assign(Block, {
  Collapse: BlockCollapse,
  Body: BlockBody,
  Footer: BlockFooter,
});
