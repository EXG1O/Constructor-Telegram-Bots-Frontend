import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/ui/Block';

import AddKeyboardButtonButton from './components/AddKeyboardButtonButton';
import AddKeyboardRowButton from './components/AddKeyboardRowButton';
import Keyboard, { KeyboardRow } from './components/Keyboard';
import KeyboardButtonBlock from './components/KeyboardButtonBlock';
import KeyboardTypes, { defaultType, Type } from './components/KeyboardTypes';

import FormToggleSection from '../../../FormToggleSection';

export interface Keyboard {
  type: Type;
  rows: KeyboardRow[];
}

export interface KeyboardBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultKeyboard: Keyboard = { type: defaultType, rows: [] };

function KeyboardBlock(props: KeyboardBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.keyboardBlock',
  });

  return (
    <FormToggleSection name='show_keyboard_block'>
      <Block {...props} variant='light'>
        <h3 className='mb-2 w-full text-center text-lg font-medium'>{t('title')}</h3>
        <KeyboardTypes className='mb-2' />
        <KeyboardButtonBlock className='mb-2' />
        <Keyboard className='mb-2' />
        <div className='flex w-full gap-2'>
          <AddKeyboardButtonButton className='w-full' />
          <AddKeyboardRowButton className='w-full' />
        </div>
      </Block>
    </FormToggleSection>
  );
}

export default KeyboardBlock;
