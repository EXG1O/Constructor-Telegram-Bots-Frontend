import React, { forwardRef, HTMLAttributes } from 'react';

import NodeBlock from './components/NodeBlock';
import NodeHandle from './components/NodeHandle';
import NodeTitle from './components/NodeTitle';
import NodeToolbar, { NodeToolbarProps } from './components/NodeToolbar';

import cn from 'utils/cn';

export interface NodeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>,
    Pick<NodeToolbarProps, 'title' | 'onEdit' | 'onDelete'> {}

const Node = forwardRef<HTMLDivElement, NodeProps>(
  ({ title, className, onEdit, onDelete, ...props }, ref) => {
    return (
      <>
        <NodeToolbar title={title} onEdit={onEdit} onDelete={onDelete} />
        <div
          {...props}
          ref={ref}
          className={cn('flex', 'flex-col', 'w-[300px]', 'gap-1.5', className)}
        />
      </>
    );
  },
);
Node.displayName = 'Node';

export default Object.assign(Node, {
  Block: NodeBlock,
  Title: NodeTitle,
  Handle: NodeHandle,
});
