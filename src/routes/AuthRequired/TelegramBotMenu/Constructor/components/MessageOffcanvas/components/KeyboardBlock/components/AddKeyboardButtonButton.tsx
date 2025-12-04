import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button, { ButtonProps } from 'components/ui/Button';

import { useMessageOffcanvasStore } from '../../../store';

export interface AddKeyboardButtonButtonProps
  extends Omit<ButtonProps, 'size' | 'variant' | 'children'> {}

function AddKeyboardButtonButton({
  onClick,
  ...props
}: AddKeyboardButtonButtonProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.keyboardBlock.addButtonButton',
  });

  const addKeyboardButtonBlockVisible = useMessageOffcanvasStore(
    ({ keyboardButtonBlock: { show, type } }) => show && type === 'add',
  );
  const showAddKeyboardButtonBlock = useMessageOffcanvasStore(
    (state) => state.keyboardButtonBlock.showBlock,
  );
  const hideAddKeyboardButtonBlock = useMessageOffcanvasStore(
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
