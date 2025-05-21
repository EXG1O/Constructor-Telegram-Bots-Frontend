import React from 'react';
import { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';

import cn from 'utils/cn';

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    return <Component {...props} ref={ref} className={cn('p-2', className)} />;
  },
);
CardBody.displayName = 'CardBody';

export default CardBody;
