import React, { forwardRef } from 'react';
import { Handle, HandleProps } from '@xyflow/react';

import cn from 'utils/cn';

export interface NodeHandleProps extends HandleProps {}

const NodeHandle = forwardRef<HTMLDivElement, NodeHandleProps>(
  ({ className, ...props }, ref) => {
    return (
      <Handle
        {...props}
        ref={ref}
        className={cn(
          'size-2.5',
          '!bg-white',
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
