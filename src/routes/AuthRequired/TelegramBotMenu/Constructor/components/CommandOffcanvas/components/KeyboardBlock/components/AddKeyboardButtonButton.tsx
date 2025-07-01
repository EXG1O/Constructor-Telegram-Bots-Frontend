import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button, { ButtonProps } from 'components/ui/Button';

import { useCommandOffcanvasStore } from '../../../store';

export interface AddKeyboardButtonButtonProps
  extends Omit<ButtonProps, 'size' | 'variant' | 'children'> {}

function AddKeyboardButtonButton({
  onClick,
  ...props
}: AddKeyboardButtonButtonProps): ReactElement {
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

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    addKeyboardButtonBlockVisible
      ? hideAddKeyboardButtonBlock()
      : showAddKeyboardButtonBlock();
    onClick?.(event);
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

export default AddKeyboardButtonButton;
