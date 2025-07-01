import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { produce } from 'immer';

import { RouteID } from 'routes';

import Button, { ButtonProps } from 'components/ui/Button';

import { KeyboardRow } from './Keyboard';

export interface AddKeyboardRowButtonProps
  extends Omit<ButtonProps, 'size' | 'variant' | 'children'> {}

function AddKeyboardRowButton({
  onClick,
  ...props
}: AddKeyboardRowButtonProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.keyboardBlock.addRowButton',
  });

  const [{ value: rows }, _meta, { setValue }] =
    useField<KeyboardRow[]>('keyboard.rows');

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    setValue(
      produce(rows, (draft) => {
        draft.push({ draggableId: crypto.randomUUID(), buttons: [] });
      }),
    );
    onClick?.(event);
  }

  return (
    <Button {...props} size='sm' variant='dark' onClick={handleClick}>
      {t('text')}
    </Button>
  );
}

export default AddKeyboardRowButton;
