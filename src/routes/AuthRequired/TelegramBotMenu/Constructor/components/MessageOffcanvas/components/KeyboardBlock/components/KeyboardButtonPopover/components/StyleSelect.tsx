import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Select, { SelectProps } from 'components/ui/Select';

import { MessageKeyboardButtonStyle } from 'api/telegram-bots/message/types';

import { useKeyboardButtonPopoverStore } from '../store';

export type Style = MessageKeyboardButtonStyle;

export interface StyleSelectProps
  extends Omit<SelectProps, 'size' | 'value' | 'error' | 'children' | 'onChange'> {}

const styles: Style[] = ['default', 'primary', 'success', 'danger'];
export const defaultStyle: Style = 'default';

function StyleSelect(props: StyleSelectProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.keyboardBlock.keyboardButtonPopover.styleSelect',
  });

  const style = useKeyboardButtonPopoverStore((state) => state.style);
  const setStyle = useKeyboardButtonPopoverStore((state) => state.setStyle);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setStyle(event.target.value as Style);
  }

  return (
    <div className='flex w-full items-center gap-1'>
      <span className='text-sm text-foreground'>{t('label')}</span>
      <Select {...props} size='sm' value={style} onChange={handleChange}>
        {styles.map((style) => (
          <option key={style} value={style}>
            {t(`styles.${style}`)}
          </option>
        ))}
      </Select>
    </div>
  );
}

export default StyleSelect;
