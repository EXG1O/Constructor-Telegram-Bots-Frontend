import React, { forwardRef } from 'react';
import {
  CollapsibleContent,
  CollapsibleContentProps,
} from '@radix-ui/react-collapsible';

import cn from 'utils/cn';

export interface CollapsibleBodyProps extends CollapsibleContentProps {}

const CollapsibleBody = forwardRef<HTMLDivElement, CollapsibleBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <CollapsibleContent
        {...props}
        ref={ref}
        className={cn(
          'w-full',
          'overflow-hidden',
          'data-[state=open]:animate-collapsible-down',
          'data-[state=closed]:animate-collapsible-up',
          className,
        )}
      />
    );
  },
);
CollapsibleBody.displayName = 'CollapsibleBody';

export default CollapsibleBody;
