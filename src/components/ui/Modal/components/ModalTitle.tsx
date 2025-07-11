import React from 'react';
import { forwardRef } from 'react';
import { DialogTitle, DialogTitleProps } from '@radix-ui/react-dialog';
import { Slot } from '@radix-ui/react-slot';

import cn from 'utils/cn';

export interface ModelTitleProps extends DialogTitleProps {}

const ModelTitle = forwardRef<HTMLHeadingElement, ModelTitleProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'h2';

    return (
      <DialogTitle asChild>
        <Component
          {...props}
          ref={ref}
          className={cn('text-xl', 'font-medium', 'text-foreground', className)}
        />
      </DialogTitle>
    );
  },
);
ModelTitle.displayName = 'ModelTitle';

export default ModelTitle;
