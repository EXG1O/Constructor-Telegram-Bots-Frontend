import React, { ReactElement } from 'react';
import { useField } from 'formik';

import Button, { ButtonProps } from 'components/ui/Button';

export interface AddonButtonProps
  extends Omit<ButtonProps, 'size' | 'variant' | 'children'> {
  name: string;
  children: NonNullable<ButtonProps['children']>;
}

function AddonButton({ name, onClick, ...props }: AddonButtonProps): ReactElement {
  const [{ value: active }, _meta, { setValue: setActive }] = useField<boolean>(name);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    setActive(!active);
    onClick?.(event);
  }

  return (
    <Button
      {...props}
      size='sm'
      variant={active ? 'secondary' : 'dark'}
      onClick={handleClick}
    />
  );
}

export default AddonButton;
