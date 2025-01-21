import React, { memo, ReactElement } from 'react';
import { useField } from 'formik';

import Button, { ButtonProps } from 'components/Button';

export interface AddonButtonProps extends Pick<ButtonProps, 'className'> {
  name: string;
  children: string;
}

function AddonButton({
  name,
  ...props
}: AddonButtonProps): ReactElement<AddonButtonProps> {
  const [{ value: show }, _meta, { setValue }] = useField<boolean>(name);

  return (
    <Button
      {...props}
      size='sm'
      variant={show ? 'secondary' : 'dark'}
      onClick={() => setValue(!show)}
    />
  );
}

export default memo(AddonButton);
