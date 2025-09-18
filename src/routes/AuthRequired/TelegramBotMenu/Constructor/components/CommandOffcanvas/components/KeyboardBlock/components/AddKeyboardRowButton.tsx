import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { FastField, FastFieldProps, FieldInputProps, FormikProps } from 'formik';
import { produce } from 'immer';

import { RouteID } from 'routes';

import Button, { ButtonProps } from 'components/ui/Button';

import { KeyboardRow } from './Keyboard';

import { FormValues } from '../../..';

export interface AddKeyboardRowButtonProps
  extends Omit<ButtonProps, 'size' | 'variant' | 'children'> {}

function AddKeyboardRowButton({
  onClick,
  ...props
}: AddKeyboardRowButtonProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.keyboardBlock.addRowButton',
  });

  function handleClick(
    form: FormikProps<FormValues>,
    field: FieldInputProps<KeyboardRow[]>,
    event: React.MouseEvent<HTMLButtonElement>,
  ): void {
    form.setFieldValue(
      field.name,
      produce(field.value, (draft) => {
        draft.push({ draggableId: crypto.randomUUID(), buttons: [] });
      }),
    );
    onClick?.(event);
  }

  return (
    <FastField name='keyboard.rows'>
      {({ field, form }: FastFieldProps) => (
        <Button
          {...props}
          size='sm'
          variant='dark'
          onClick={(event) => handleClick(form, field, event)}
        >
          {t('text')}
        </Button>
      )}
    </FastField>
  );
}

export default AddKeyboardRowButton;
