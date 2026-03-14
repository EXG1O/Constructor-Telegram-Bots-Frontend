import React, { type ReactElement } from 'react';
import { FastField, type FastFieldProps } from 'formik';

import Button, { type ButtonProps } from 'components/ui/Button';

import composeHandlers from 'utils/composeHandlers';

export interface AddonButtonProps extends Omit<
  ButtonProps,
  'size' | 'variant' | 'children'
> {
  name: string;
  children: NonNullable<ButtonProps['children']>;
}

function AddonButton({ name, onClick, ...props }: AddonButtonProps): ReactElement {
  return (
    <FastField name={name}>
      {({ field, form }: FastFieldProps) => (
        <Button
          {...props}
          size='sm'
          variant={field.value ? 'secondary' : 'dark'}
          onClick={composeHandlers(
            (_event) => form.setFieldValue(name, !field.value),
            onClick,
          )}
        />
      )}
    </FastField>
  );
}

export default AddonButton;
