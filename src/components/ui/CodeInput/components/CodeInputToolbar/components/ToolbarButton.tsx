import React, { forwardRef } from 'react';

import IconButton, { type IconButtonProps } from 'components/ui/IconButton';

import cn from 'utils/cn';

import type { Size } from '../../..';
import { useCodeInputStore } from '../../../store';

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
