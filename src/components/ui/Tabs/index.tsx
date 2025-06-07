import React, { forwardRef, HTMLAttributes, useMemo } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import TabsButton from './components/TabsButton';
import TabsContext, { TabsContextProps } from './contexts/TabsContext';

import cn from 'utils/cn';

export const tabsVariants = cva(['flex', 'w-full', 'bg-gray-200'], {
  variants: {
    size: {
      sm: ['rounded-sm', 'p-1'],
      md: ['rounded-md', 'p-1.5'],
      lg: ['rounded-lg', 'p-2'],
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>,
    Partial<Pick<TabsContextProps, 'size'>>,
    Omit<TabsContextProps, 'size'> {
  asChild?: boolean;
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ asChild, size = 'md', value, className, children, onChange, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    const contextValue = useMemo<TabsContextProps>(
      () => ({ size, value, onChange }),
      [size, value, onChange],
    );

    return (
      <Component {...props} ref={ref} className={cn(tabsVariants({ size, className }))}>
        <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>
      </Component>
    );
  },
);
Tabs.displayName = 'Tabs';

export default Object.assign(Tabs, { Button: TabsButton });
