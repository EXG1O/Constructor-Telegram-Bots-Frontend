import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';
import { produce } from 'immer';

import { RouteID } from 'routes';

import Button, { ButtonProps } from 'components/ui/Button';

import { KeyboardRow } from './Keyboard';

export type AddKeyboardRowButtonProps = Pick<ButtonProps, 'className'>;

function AddKeyboardRowButton(
  props: AddKeyboardRowButtonProps,
): ReactElement<AddKeyboardRowButtonProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.keyboardBlock.addRowButton',
  });

  const [{ value: rows }, _meta, { setValue }] =
    useField<KeyboardRow[]>('keyboard.rows');

  function handleClick(): void {
    setValue(
      produce(rows, (draft) => {
        draft.push({ draggableId: crypto.randomUUID(), buttons: [] });
      }),
    );
  }

  return (
    <Button {...props} size='sm' variant='dark' onClick={handleClick}>
      {t('text')}
    </Button>
  );
}

export default memo(AddKeyboardRowButton);
