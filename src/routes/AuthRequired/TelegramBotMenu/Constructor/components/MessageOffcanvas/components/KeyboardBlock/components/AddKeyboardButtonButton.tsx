import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';

import Button, { type ButtonProps } from 'components/ui/Button';

import KeyboardButtonPopover from './KeyboardButtonPopover';

export interface AddKeyboardButtonButtonProps extends Omit<
  ButtonProps,
  'size' | 'variant' | 'children'
> {}

function AddKeyboardButtonButton(props: AddKeyboardButtonButtonProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'messageOffcanvas.keyboardBlock.addButtonButton' },
  );

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
