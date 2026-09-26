import React, { forwardRef } from 'react';
import { Handle, type HandleProps, Position } from '@xyflow/react';

import { ConnectionHandlePosition } from 'api';

import cn from 'utils/cn';

import type { NodeType } from '../../../enums';
import { buildEdgeHandle, type EdgeHandle } from '../../../utils/edges';

export interface NodeHandleProps
  extends Omit<HandleProps, 'position'>, EdgeHandle<NodeType> {}

const positionMap: Record<ConnectionHandlePosition, Position> = {
  [ConnectionHandlePosition.Left]: Position.Left,
  [ConnectionHandlePosition.Right]: Position.Right,
};

const NodeHandle = forwardRef<HTMLDivElement, NodeHandleProps>(
  ({ objectType, objectID, nestedObjectID, position, className, ...props }, ref) => {
    return (
      <Handle
        {...props}
        ref={ref}
        id={buildEdgeHandle({ objectType, objectID, nestedObjectID, position })}
        position={positionMap[position]}
        className={cn(
          'size-2.5',
          'bg-white!',
          'border',
          'border-outline',
          'rounded-full',
          className,
        )}
      />
    );
  },
);
NodeHandle.displayName = 'NodeHandle';

export default NodeHandle;
