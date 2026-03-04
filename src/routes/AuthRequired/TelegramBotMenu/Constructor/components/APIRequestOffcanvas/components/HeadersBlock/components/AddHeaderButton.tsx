import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FastField,
  type FastFieldProps,
  type FieldInputProps,
  type FormikProps,
} from 'formik';

import { RouteID } from 'routes';

import Button, { type ButtonProps } from 'components/ui/Button';

import cn from 'utils/cn';

import type { Headers } from '..';

export interface AddHeaderButtonProps extends Omit<
  ButtonProps,
  'size' | 'variant' | 'children'
> {}

function AddHeaderButton({
  className,
  onClick,
  ...props
}: AddHeaderButtonProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestOffcanvas.headersBlock.addHeaderButton',
  });

  function handleClick(
    form: FormikProps<any>,
    field: FieldInputProps<Headers>,
    event: React.MouseEvent<HTMLButtonElement>,
  ): void {
    form.setFieldValue(field.name, [...field.value, { key: '', value: '' }]);
    onClick?.(event);
  }

  return (
    <FastField name='headers'>
      {({ field, form }: FastFieldProps) => (
        <Button
          {...props}
          size='sm'
          variant='dark'
          className={cn('w-full', className)}
          onClick={(event) => handleClick(form, field, event)}
        >
          {t('text')}
        </Button>
      )}
    </FastField>
  );
}

export default AddHeaderButton;
