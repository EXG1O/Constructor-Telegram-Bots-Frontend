import React, { forwardRef, HTMLAttributes } from 'react';

import NodeBlock from './components/NodeBlock';
import NodeToolbar, { NodeToolbarProps } from './components/NodeToolbar';

import { FCA } from 'utils/helpers';
import classNames from 'classnames';

export type NodeProps = HTMLAttributes<HTMLDivElement> &
  Pick<NodeToolbarProps, 'title' | 'onEdit' | 'onDelete'>;

const Node: FCA<'div', NodeProps> = forwardRef<HTMLDivElement, NodeProps>(function Node(
  { title, className, onEdit, onDelete, style, ...props },
  ref,
) {
  return (
    <>
      <NodeToolbar title={title} onEdit={onEdit} onDelete={onDelete} />
      <div {...props} ref={ref} className={classNames('flex flex-col gap-2', className)} style={{ width: '300px', ...style }} />
    </>
  );
});

export default Object.assign(Node, { Block: NodeBlock });
