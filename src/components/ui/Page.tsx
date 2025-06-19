import React, { forwardRef, HTMLAttributes, useEffect } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';

import Container from 'components/ui/Container';

import cn from 'utils/cn';

export const pageVariants = cva(['my-2', 'lg:my-3'], {
  variants: {
    flex: {
      true: ['flex', 'flex-col'],
    },
    grid: {
      true: ['grid'],
    },
    gutters: {
      true: ['gap-3', 'lg:gap-4'],
    },
  },
});

export interface PageProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof pageVariants> {
  asChild?: boolean;
  title: string;
}

const Page = forwardRef<HTMLElement, PageProps>(
  ({ asChild, title, flex, grid, gutters, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'main';

    useEffect(() => {
      document.title = `${title} - Constructor Telegram Bots`;
    }, [title]);

    return (
      <Container asChild>
        <Component
          {...props}
          ref={ref}
          className={cn(pageVariants({ flex, grid, gutters, className }))}
        />
      </Container>
    );
  },
);
Page.displayName = 'Page';

export default Page;
