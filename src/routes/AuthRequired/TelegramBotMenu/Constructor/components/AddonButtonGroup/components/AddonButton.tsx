import React, { ReactElement } from 'react';
import { FastField, FastFieldProps, FieldInputProps, FormikProps } from 'formik';

import Button, { ButtonProps } from 'components/ui/Button';

export interface AddonButtonProps
  extends Omit<ButtonProps, 'size' | 'variant' | 'children'> {
  name: string;
  children: NonNullable<ButtonProps['children']>;
}

function AddonButton({ name, onClick, ...props }: AddonButtonProps): ReactElement {
  function handleClick(
    form: FormikProps<any>,
    field: FieldInputProps<boolean>,
    event: React.MouseEvent<HTMLButtonElement>,
  ): void {
    form.setFieldValue(name, !field.value);
    onClick?.(event);
  }

  return (
    <FastField name={name}>
      {({ field, form }: FastFieldProps) => (
        <Button
          {...props}
          size='sm'
          variant={field.value ? 'secondary' : 'dark'}
          onClick={(event) => handleClick(form, field, event)}
        />
      )}
    </FastField>
  );
}

export default AddonButton;
