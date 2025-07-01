import React, { forwardRef, HTMLAttributes } from 'react';
import { NodeToolbar as BaseNodeToolbar } from '@xyflow/react';
import { SquarePen, Trash2 } from 'lucide-react';

import IconButton from 'components/ui/IconButton';

import cn from 'utils/cn';

export interface NodeToolbarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  title: string;
  onEdit: React.MouseEventHandler<HTMLButtonElement>;
  onDelete: React.MouseEventHandler<HTMLButtonElement>;
}

const NodeToolbar = forwardRef<HTMLDivElement, NodeToolbarProps>(
  ({ title, className, onEdit, onDelete, ...props }, ref) => {
    return (
      <BaseNodeToolbar isVisible offset={8}>
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
      </BaseNodeToolbar>
    );
  },
);
NodeToolbar.displayName = 'NodeToolbar';

export default NodeToolbar;
