import React, { forwardRef } from 'react';
import { Plus } from 'lucide-react';

import Button, { ButtonProps } from 'components/ui/Button';

export type AddButtonProps = ButtonProps;

const AddButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <Button {...props} ref={ref}>
        <Plus strokeWidth={2.75} />
        {children}
      </Button>
    );
  },
);
AddButton.displayName = 'AddButton';

export default AddButton;
