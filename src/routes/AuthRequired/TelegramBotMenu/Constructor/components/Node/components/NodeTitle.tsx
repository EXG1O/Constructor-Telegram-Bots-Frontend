import React, { forwardRef, type HTMLAttributes } from 'react';

import cn from 'utils/cn';

export interface NodeTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const NodeTitle = forwardRef<HTMLHeadingElement, NodeTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h5
        {...props}
        ref={ref}
        className={cn('w-full', 'font-semibold', 'text-center', className)}
      />
    );
  },
);
NodeTitle.displayName = 'NodeTitle';

export default NodeTitle;
