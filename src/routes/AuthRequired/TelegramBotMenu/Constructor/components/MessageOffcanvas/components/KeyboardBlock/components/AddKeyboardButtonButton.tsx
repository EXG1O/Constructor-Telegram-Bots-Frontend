import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button, { ButtonProps } from 'components/ui/Button';

import KeyboardButtonPopover from './KeyboardButtonPopover';

export interface AddKeyboardButtonButtonProps
  extends Omit<ButtonProps, 'size' | 'variant' | 'children'> {}

function AddKeyboardButtonButton(props: AddKeyboardButtonButtonProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.keyboardBlock.addButtonButton',
  });

  return (
    <KeyboardButtonPopover>
      <KeyboardButtonPopover.Trigger asChild>
        <Button {...props} size='sm' variant='dark'>
          {t('text')}
        </Button>
      </KeyboardButtonPopover.Trigger>
    </KeyboardButtonPopover>
  );
}

export default AddKeyboardButtonButton;
