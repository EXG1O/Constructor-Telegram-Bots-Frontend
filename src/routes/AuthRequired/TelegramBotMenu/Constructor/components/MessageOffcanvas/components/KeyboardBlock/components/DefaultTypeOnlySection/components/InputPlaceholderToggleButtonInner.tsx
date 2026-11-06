import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';

import Popover from 'components/ui/Popover';

export interface InputPlaceholderToggleButtonInnerProps {
  text: string;
}

function InputPlaceholderToggleButtonInner({
  text,
}: InputPlaceholderToggleButtonInnerProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    {
      keyPrefix:
        'messageOffcanvas.keyboardBlock.defaultTypeOnlySection.inputPlaceholder.toggleButton',
    },
  );

  return (
    <>
      <span>{text}</span>
      <Popover>
        <Popover.QuestionTriggerIconButton
          size='xs'
          className='mt-0.5'
          onClick={(event) => event.stopPropagation()}
        />
        <Popover.Body size='sm' content='text'>
          {t('helpText')}
        </Popover.Body>
      </Popover>
    </>
  );
}

export default InputPlaceholderToggleButtonInner;
