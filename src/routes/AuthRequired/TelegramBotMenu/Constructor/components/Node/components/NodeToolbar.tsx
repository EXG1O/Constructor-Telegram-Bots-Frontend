import React, { FC, forwardRef, HTMLAttributes } from 'react';
import {
  NodeToolbar as FRNodeToolbar,
  NodeToolbarProps as FRToolbarProps,
} from '@xyflow/react';
import { SquarePen, Trash2 } from 'lucide-react';

import IconButton from 'components/ui/IconButton';

import cn from 'utils/cn';

const PrimitiveNodeToolbar: FC<FRToolbarProps> = FRNodeToolbar;
PrimitiveNodeToolbar.displayName = 'PrimitiveNodeToolbar';

export interface NodeToolbarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  title: string;
  onEdit: React.MouseEventHandler<HTMLButtonElement>;
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
}

const NodeToolbar = forwardRef<HTMLDivElement, NodeToolbarProps>(
  ({ title, className, onEdit, onDelete, ...props }, ref) => {
    return (
      <PrimitiveNodeToolbar isVisible offset={8}>
        <div
          {...props}
          ref={ref}
          className={cn('flex', 'items-center', 'gap-2', className)}
        >
          <IconButton className='text-foreground' onClick={onEdit}>
            <SquarePen />
          </IconButton>
          <span className='cursor-default rounded-sm bg-dark px-2 text-dark-foreground select-none'>
            {title}
          </span>
          <IconButton className='-ms-0.25 text-danger' onClick={onDelete}>
            <Trash2 />
          </IconButton>
        </div>
      </PrimitiveNodeToolbar>
    );
  },
);
NodeToolbar.displayName = 'NodeToolbar';

export default NodeToolbar;
