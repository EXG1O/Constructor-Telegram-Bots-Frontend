import React, { forwardRef } from 'react';
import { cva } from 'class-variance-authority';

import Button, { ButtonProps } from 'components/ui/Button';

import useTabs from '../hooks/useTabs';

export const tabsButtonVariants = cva(['w-full'], {
  variants: {
    active: {
      false: ['text-muted', 'focus-visible:ring-gray-400/50'],
      true: [
        'bg-background',
        'text-foreground',
        'shadow-sm',
        'focus-visible:ring-background/50',
      ],
    },
  },
  defaultVariants: {
    active: false,
  },
});

export interface TabsButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  value: string;
}

const TabsButton = forwardRef<HTMLButtonElement, TabsButtonProps>(
  ({ value, className, ...props }, ref) => {
    const { size, value: activeValue, onChange } = useTabs();

    function handleClick(): void {
      onChange?.(value);
    }

    return (
      <Button
        {...props}
        ref={ref}
        size={size}
        className={tabsButtonVariants({ active: value == activeValue, className })}
        onClick={handleClick}
      />
    );
  },
);
TabsButton.displayName = 'TabsButton';

export default TabsButton;
