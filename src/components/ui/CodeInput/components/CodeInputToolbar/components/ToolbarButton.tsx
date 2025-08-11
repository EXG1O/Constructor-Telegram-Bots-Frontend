import React, { forwardRef } from 'react';

import IconButton, { IconButtonProps } from 'components/ui/IconButton';

import useCodeInputStore from '../../../hooks/useCodeInputStore';

import cn from 'utils/cn';

import { Size } from '../../..';

const SIZE_MAP: Record<Size, NonNullable<IconButtonProps['size']>> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

export interface ToolbarButtonProps extends Omit<IconButtonProps, 'size'> {}

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, ...props }, ref) => {
    const size = useCodeInputStore((state) => state.size);

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
