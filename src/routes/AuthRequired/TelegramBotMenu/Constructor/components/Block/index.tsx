import React, { forwardRef } from 'react';

import Card, { CardProps } from 'components/Card';

import BlockBody from './components/BlockBody';
import BlockCollapse from './components/BlockCollapse';
import BlockFooter from './components/BlockFooter';

import { FCA } from 'utils/helpers';

export interface BlockProps extends CardProps {
  title: string;
}

const Block: FCA<'div', BlockProps> = forwardRef<HTMLElement, BlockProps>(
  function Block({ title, body, children, ...props }, ref) {
    return (
      <Card ref={ref} {...props}>
        <Card.Header as='h6' className='text-center'>
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
