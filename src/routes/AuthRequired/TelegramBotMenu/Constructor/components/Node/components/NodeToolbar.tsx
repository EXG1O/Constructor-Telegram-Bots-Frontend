import React, { type FC, forwardRef, type HTMLAttributes } from 'react';
import {
  NodeToolbar as FRNodeToolbar,
  type NodeToolbarProps as FRToolbarProps,
} from '@xyflow/react';
import { Copy, SquarePen, Trash2 } from 'lucide-react';

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
  onDuplicate?: React.MouseEventHandler<HTMLButtonElement>;
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
}

const NodeToolbar = forwardRef<HTMLDivElement, NodeToolbarProps>(
  ({ title, className, onEdit, onDuplicate, onDelete, ...props }, ref) => {
    return (
      <PrimitiveNodeToolbar isVisible offset={8}>
        <div
          {...props}
          ref={ref}
          className={cn('flex', 'flex-col', 'gap-1', className)}
        >
          <span className='cursor-default rounded-sm bg-dark px-2 text-dark-foreground select-none'>
            {title}
          </span>
          <div className='flex justify-center gap-1'>
            <IconButton className='text-foreground' onClick={onEdit}>
              <SquarePen />
            </IconButton>
            {onDuplicate && (
              <IconButton className='text-foreground' onClick={onDuplicate}>
                <Copy />
              </IconButton>
            )}
            <IconButton className='-ms-0.25 text-danger' onClick={onDelete}>
              <Trash2 />
            </IconButton>
          </div>
        </div>
      </PrimitiveNodeToolbar>
    );
  },
);
NodeToolbar.displayName = 'NodeToolbar';

export default NodeToolbar;
