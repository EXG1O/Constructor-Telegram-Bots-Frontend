import React, { forwardRef } from 'react';

import IconButton, { IconButtonProps } from 'components/ui/IconButton';

import useSimpleInputStore from '../../../hooks/useSimpleInputStore';

import cn from 'utils/cn';

import { Size } from '../../..';

export interface ToolbarButtonProps extends Omit<IconButtonProps, 'size'> {}

const SIZE_MAP: Record<Size, NonNullable<IconButtonProps['size']>> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, ...props }, ref) => {
    const size = useSimpleInputStore((state) => state.size);

    return (
      <IconButton
        {...props}
        ref={ref}
        size={SIZE_MAP[size]}
        className={cn(
          'text-foreground',
          'hover:text-primary-accent',
          'focus-visible:text-primary-accent',
          className,
        )}
      />
    );
  },
);
ToolbarButton.displayName = 'ToolbarButton';

export default ToolbarButton;
