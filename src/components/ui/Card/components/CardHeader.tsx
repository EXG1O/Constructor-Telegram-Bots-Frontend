import React from 'react';
import { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';

import cn from 'utils/cn';

export interface CardHeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  asChild?: boolean;
}

const CardHeader = forwardRef<HTMLHeadingElement, CardHeaderProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'h6';

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(
          'bg-foreground/3',
          'border-b',
          'border-outline',
          'text-base',
          'font-medium',
          'text-foreground',
          'text-center',
          'px-4',
          'py-2',
          className,
        )}
      />
    );
  },
);
CardHeader.displayName = 'CardHeader';

export default CardHeader;
