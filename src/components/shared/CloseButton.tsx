import React, { forwardRef } from 'react';
import { X } from 'lucide-react';

import IconButton, { IconButtonProps } from 'components/ui/IconButton';

import cn from 'utils/cn';

export interface CloseButtonProps extends IconButtonProps {}

const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  ({ size = 'lg', className, ...props }, ref) => {
    return (
      <IconButton
        {...props}
        ref={ref}
        size={size}
        className={cn('opacity-80', 'hover:opacity-100', className)}
      >
        <X />
      </IconButton>
    );
  },
);
CloseButton.displayName = 'CloseButton';

export default CloseButton;
