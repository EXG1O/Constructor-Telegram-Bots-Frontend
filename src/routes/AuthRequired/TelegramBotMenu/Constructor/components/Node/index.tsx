import React, { forwardRef } from 'react';

import Stack, { StackProps } from 'components/Stack';

import NodeBlock from './components/NodeBlock';
import NodeToolbar, { NodeToolbarProps } from './components/NodeToolbar';

import { FCA } from 'utils/helpers';

export type NodeProps = StackProps &
  Pick<NodeToolbarProps, 'title' | 'onEdit' | 'onDelete'>;

const Node: FCA<'div', NodeProps> = forwardRef<HTMLElement, NodeProps>(function Node(
  { title, onEdit, onDelete, style, ...props },
  ref,
) {
  return (
    <>
      <NodeToolbar title={title} onEdit={onEdit} onDelete={onDelete} />
      <Stack gap={2} {...props} ref={ref} style={{ width: '300px', ...style }} />
    </>
  );
});

export default Object.assign(Node, { Block: NodeBlock });
