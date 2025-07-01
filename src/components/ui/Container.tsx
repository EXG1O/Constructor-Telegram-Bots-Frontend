import React from 'react';
import { forwardRef, HTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';

import cn from 'utils/cn';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ asChild, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(
          'w-full',
          'sm:max-w-sm',
          'md:max-w-md',
          'lg:max-w-lg',
          'xl:max-w-xl',
          '2xl:max-w-2xl',
          'mx-auto',
          'px-3',
          className,
        )}
      />
    );
  },
);
Container.displayName = 'Container';

export default Container;
