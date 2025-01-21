import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Stack from 'components/Stack';

import AddKeyboardButtonButton from './components/AddKeyboardButtonButton';
import AddKeyboardRowButton from './components/AddKeyboardRowButton';
import Keyboard, { KeyboardRow } from './components/Keyboard';
import KeyboardButtonBlock from './components/KeyboardButtonBlock';
import KeyboardTypeButtonGroup, {
  defaultType,
  Type,
} from './components/KeyboardTypeButtonGroup';

import Block, { BlockProps } from '../../../Block';

export interface Keyboard {
  type: Type;
  rows: KeyboardRow[];
}

export type KeyboardBlockProps = Pick<BlockProps, 'className'>;

export const defaultKeyboard: Keyboard = { type: defaultType, rows: [] };

function KeyboardBlock(props: KeyboardBlockProps): ReactElement<KeyboardBlockProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.keyboardBlock',
  });

  return (
    <Block.Collapse name='show_keyboard_block'>
      <Block {...props} title={t('title')}>
        <Block.Body as={Stack} gap={2}>
          <KeyboardTypeButtonGroup />
          <KeyboardButtonBlock />
          <Keyboard />
        </Block.Body>
        <Block.Footer className='d-flex gap-2'>
          <AddKeyboardButtonButton className='w-50' />
          <AddKeyboardRowButton className='w-50' />
        </Block.Footer>
      </Block>
    </Block.Collapse>
  );
}

export default memo(KeyboardBlock);
