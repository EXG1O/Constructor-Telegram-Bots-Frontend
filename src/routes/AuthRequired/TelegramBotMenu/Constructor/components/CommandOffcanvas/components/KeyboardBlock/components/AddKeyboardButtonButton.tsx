import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button, { ButtonProps } from 'components/Button';

import { useCommandOffcanvasStore } from '../../../store';

export type AddKeyboardButtonButtonProps = Pick<ButtonProps, 'className'>;

function AddKeyboardButtonButton(
  props: AddKeyboardButtonButtonProps,
): ReactElement<AddKeyboardButtonButtonProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.keyboardBlock.addButtonButton',
  });

  const addKeyboardButtonBlockVisible = useCommandOffcanvasStore(
    ({ keyboardButtonBlock: { show, type } }) => show && type === 'add',
  );
  const showAddKeyboardButtonBlock = useCommandOffcanvasStore(
    (state) => state.keyboardButtonBlock.showBlock,
  );
  const hideAddKeyboardButtonBlock = useCommandOffcanvasStore(
    (state) => state.keyboardButtonBlock.hideBlock,
  );

  function handleClick(): void {
    addKeyboardButtonBlockVisible
      ? hideAddKeyboardButtonBlock()
      : showAddKeyboardButtonBlock();
  }

  return (
    <Button
      {...props}
      size='sm'
      variant={addKeyboardButtonBlockVisible ? 'secondary' : 'dark'}
      onClick={handleClick}
    >
      {t('text')}
    </Button>
  );
}

export default memo(AddKeyboardButtonButton);
