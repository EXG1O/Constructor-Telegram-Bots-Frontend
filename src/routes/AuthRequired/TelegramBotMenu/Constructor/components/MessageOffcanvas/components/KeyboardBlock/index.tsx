import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block, { type BlockProps } from 'components/ui/Block';

import AddKeyboardButtonButton from './components/AddKeyboardButtonButton';
import AddKeyboardRowButton from './components/AddKeyboardRowButton';
import Keyboard, { type KeyboardRow } from './components/Keyboard';
import KeyboardTypes, { defaultType, type Type } from './components/KeyboardTypes';

import cn from 'utils/cn';

export interface Keyboard {
  type: Type;
  rows: KeyboardRow[];
}

export interface KeyboardBlockFormValues {
  keyboard: Keyboard;
}

export interface KeyboardBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultKeyboard: Keyboard = { type: defaultType, rows: [] };
export const defaultKeyboardBlockFormValues: KeyboardBlockFormValues = {
  keyboard: defaultKeyboard,
};

function KeyboardBlock({ className, ...props }: KeyboardBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.keyboardBlock',
  });

  return (
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-2', className)}
    >
      <Block.Title>
        <h3 className='text-lg font-medium'>{t('title')}</h3>
      </Block.Title>
      <KeyboardTypes />
      <Keyboard />
      <div className='flex w-full gap-2'>
        <AddKeyboardButtonButton className='w-full' />
        <AddKeyboardRowButton className='w-full' />
      </div>
    </Block>
  );
}

export default KeyboardBlock;
