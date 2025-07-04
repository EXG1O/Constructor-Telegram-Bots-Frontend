import React, { forwardRef } from 'react';

import Button, { ButtonProps } from 'components/ui/Button';
import Collapsible from 'components/ui/Collapsible';

import useFormToggleSection from '../hooks/useFormToggleSection';

import cn from 'utils/cn';

export interface TriggerButtonProps extends ButtonProps {
  openProps?: ButtonProps;
  closedProps?: ButtonProps;
}

const TriggerButton = forwardRef<HTMLButtonElement, TriggerButtonProps>(
  ({ variant, openProps, closedProps, className, ...props }, ref) => {
    const { open } = useFormToggleSection();

    const {
      variant: activeVariant,
      className: activeClassName,
      ...activeProps
    } = (open ? openProps : closedProps) ?? {};

    return (
      <Collapsible.Trigger asChild>
        <Button
          {...activeProps}
          {...props}
          ref={ref}
          variant={
            variant === undefined
              ? activeVariant === undefined
                ? open
                  ? 'secondary'
                  : 'dark'
                : activeVariant
              : variant
          }
          className={cn(
            'w-full',
            'data-[state=open]:rounded-b-none',
            activeClassName,
            className,
          )}
        />
      </Collapsible.Trigger>
    );
  },
);
TriggerButton.displayName = 'TriggerButton';

export default TriggerButton;
