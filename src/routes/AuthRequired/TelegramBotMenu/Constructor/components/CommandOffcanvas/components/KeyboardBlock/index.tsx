import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/ui/Block';

import AddKeyboardButtonButton from './components/AddKeyboardButtonButton';
import AddKeyboardRowButton from './components/AddKeyboardRowButton';
import Keyboard, { KeyboardRow } from './components/Keyboard';
import KeyboardButtonBlock from './components/KeyboardButtonBlock';
import KeyboardTypes, { defaultType, Type } from './components/KeyboardTypes';

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

function KeyboardBlock(props: KeyboardBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.keyboardBlock',
  });

  return (
    <Block {...props} variant='light'>
      <Block.Title>
        <h3 className='mb-2 text-lg font-medium'>{t('title')}</h3>
      </Block.Title>
      <KeyboardTypes className='mb-2' />
      <KeyboardButtonBlock className='mb-2' />
      <Keyboard className='mb-2' />
      <div className='flex w-full gap-2'>
        <AddKeyboardButtonButton className='w-full' />
        <AddKeyboardRowButton className='w-full' />
      </div>
    </Block>
  );
}

export default KeyboardBlock;
