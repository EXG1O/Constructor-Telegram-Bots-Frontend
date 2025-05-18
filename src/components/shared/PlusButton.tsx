import React, { forwardRef } from 'react';
import { Plus } from 'lucide-react';

import Button, { ButtonProps, buttonVariants } from 'components/ui/Button';

export { buttonVariants as plusButtonVariants };

export type PlusButtonProps = ButtonProps;

const PlusButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <Button {...props} ref={ref}>
        <Plus strokeWidth={2.75} />
        {children}
      </Button>
    );
  },
);
PlusButton.displayName = 'PlusButton';

export default PlusButton;
