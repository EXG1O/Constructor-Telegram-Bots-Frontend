import React from 'react';
import { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';

import cn from 'utils/cn';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(
          'bg-foreground/3',
          'border-t',
          'border-outline',
          'px-4',
          'py-2',
          className,
        )}
      />
    );
  },
);
CardFooter.displayName = 'CardFooter';

export default CardFooter;
