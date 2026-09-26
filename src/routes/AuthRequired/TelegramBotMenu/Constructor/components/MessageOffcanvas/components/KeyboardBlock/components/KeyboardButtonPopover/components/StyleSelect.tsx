import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';

import Select, { type SelectProps } from 'components/ui/Select';

import {
  MessageKeyboardButtonStyle,
  MessageKeyboardButtonStyle as MessageKeyboardButtonStyleType,
} from 'api';

import { useKeyboardButtonPopoverStore } from '../store';

export type Style = MessageKeyboardButtonStyleType;

export interface StyleSelectProps extends Omit<
  SelectProps,
  'size' | 'value' | 'error' | 'children' | 'onChange'
> {}

export const defaultStyle: Style = MessageKeyboardButtonStyle.Default;

function StyleSelect(props: StyleSelectProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'messageOffcanvas.keyboardBlock.keyboardButtonPopover.styleSelect' },
  );

  const style = useKeyboardButtonPopoverStore((state) => state.style);
  const setStyle = useKeyboardButtonPopoverStore((state) => state.setStyle);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setStyle(event.target.value as Style);
  }

  return (
    <div className='flex w-full items-center gap-1'>
      <span className='text-sm text-foreground'>{t('label')}</span>
      <Select {...props} size='sm' value={style} onChange={handleChange}>
        {Object.values(MessageKeyboardButtonStyleType).map((style) => (
          <option key={style} value={style}>
            {t(`styles.${style}`)}
          </option>
        ))}
      </Select>
    </div>
  );
}

export default StyleSelect;
