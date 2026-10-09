import React, { type FC, forwardRef, type HTMLAttributes } from 'react';
import {
  NodeToolbar as FRNodeToolbar,
  type NodeToolbarProps as FRToolbarProps,
  useNodeId,
  useStore,
} from '@xyflow/react';
import { Copy, SquarePen, Trash2 } from 'lucide-react';

import Collapsible from 'components/ui/Collapsible';
import IconButton from 'components/ui/IconButton';

import cn from 'utils/cn';

const PrimitiveNodeToolbar: FC<FRToolbarProps> = FRNodeToolbar;
PrimitiveNodeToolbar.displayName = 'PrimitiveNodeToolbar';

export interface NodeToolbarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'onDuplicate'
> {
  title: string;
  onEdit: React.MouseEventHandler<HTMLButtonElement>;
  onDuplicate: React.MouseEventHandler<HTMLButtonElement>;
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
}

const NodeToolbar = forwardRef<HTMLDivElement, NodeToolbarProps>(
  ({ title, className, onEdit, onDuplicate, onDelete, ...props }, ref) => {
    const nodeID = useNodeId();
    const isNodeSelected = useStore<boolean>((state) =>
      Boolean(nodeID && state.nodeLookup.get(nodeID)?.selected),
    );

    return (
      <PrimitiveNodeToolbar isVisible offset={4}>
        <div
          {...props}
          ref={ref}
          className={cn('flex', 'flex-col', 'items-center', className)}
        >
          <span className='w-fit cursor-default rounded-sm bg-dark px-2 text-center text-dark-foreground select-none'>
            {title}
          </span>
          <Collapsible open={isNodeSelected}>
            <Collapsible.Body className='duration-175'>
              <div className='mt-1 flex w-full justify-center gap-1'>
                <IconButton className='text-foreground' onClick={onEdit}>
                  <SquarePen />
                </IconButton>
                <IconButton className='text-foreground' onClick={onDuplicate}>
                  <Copy />
                </IconButton>
                <IconButton className='-ms-px text-danger' onClick={onDelete}>
                  <Trash2 />
                </IconButton>
              </div>
            </Collapsible.Body>
          </Collapsible>
        </div>
      </PrimitiveNodeToolbar>
    );
  },
);
NodeToolbar.displayName = 'NodeToolbar';

export default NodeToolbar;
