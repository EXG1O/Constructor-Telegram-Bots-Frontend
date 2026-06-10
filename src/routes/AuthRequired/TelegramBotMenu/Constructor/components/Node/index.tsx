import React, { forwardRef, type HTMLAttributes } from 'react';

import NodeBlock from './components/NodeBlock';
import NodeHandle from './components/NodeHandle';
import NodeTitle from './components/NodeTitle';
import NodeToolbar, { type NodeToolbarProps } from './components/NodeToolbar';

import cn from 'utils/cn';

export interface NodeProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onDuplicate'>,
    Pick<NodeToolbarProps, 'title' | 'onEdit' | 'onDuplicate' | 'onDelete'> {}

const Node = forwardRef<HTMLDivElement, NodeProps>(
  ({ title, className, onEdit, onDuplicate, onDelete, ...props }, ref) => {
    return (
      <>
        <NodeToolbar
          title={title}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
        <div
          {...props}
          ref={ref}
          className={cn('flex', 'flex-col', 'w-75', 'gap-1.5', className)}
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
