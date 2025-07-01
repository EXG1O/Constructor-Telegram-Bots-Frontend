import React, { forwardRef, HTMLAttributes } from 'react';

import cn from 'utils/cn';

export interface NodeTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const NodeTitle = forwardRef<HTMLHeadingElement, NodeTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h5 {...props} ref={ref} className={cn('w-full', 'font-medium', 'text-center')} />
    );
  },
);
NodeTitle.displayName = 'NodeTitle';

export default NodeTitle;
