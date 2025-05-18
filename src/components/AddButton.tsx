import React, { memo, ReactElement } from 'react';
import classNames from 'classnames';

import Button, { ButtonProps } from 'components/ui/Button';

import PlusIcon from 'assets/icons/plus.svg';

export type AddButtonProps = ButtonProps;

const iconSizes: Record<NonNullable<AddButtonProps['size']>, number> = {
  sm: 21,
  lg: 30,
};

function AddButton({
  size,
  className,
  children,
  ...props
}: AddButtonProps): ReactElement<AddButtonProps> {
  const paddingStart: number = size === 'sm' ? 1 : 2;
  const iconSize: number = size ? iconSizes[size] : 23;

  return (
    <Button
      {...props}
      size={size}
      className={classNames(
        `d-flex justify-content-center align-items-center ps-${paddingStart}`,
        className,
      )}
    >
      <PlusIcon width={iconSize} height={iconSize} />
      {children}
    </Button>
  );
}

export default memo(AddButton);
