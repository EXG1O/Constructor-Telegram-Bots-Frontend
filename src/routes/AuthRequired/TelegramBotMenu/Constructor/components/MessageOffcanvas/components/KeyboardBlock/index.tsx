import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';

import Block, { type BlockProps } from 'components/ui/Block';

import AddKeyboardButtonButton from './components/AddKeyboardButtonButton';
import AddKeyboardRowButton from './components/AddKeyboardRowButton';
import DefaultTypeOnlySection from './components/DefaultTypeOnlySection';
import DraggableKeyboard from './components/DraggableKeyboard';
import KeyboardTypeTabs from './components/KeyboardTypeTabs';
import { Type } from './components/KeyboardTypeTabs/enums';

import FormToggleSection from '../../../FormToggleSection';

export interface KeyboardBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

function KeyboardBlock(props: KeyboardBlockProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'messageOffcanvas.keyboardBlock' },
  );

  return (
    <Block {...props} variant='light'>
      <Block.Title>
        <h3 className='text-lg font-medium'>{t('title')}</h3>
      </Block.Title>
      <KeyboardTypeTabs className='mt-2' />
      <DefaultTypeOnlySection className='mt-2' />
      <FormToggleSection
        name='keyboard.type'
        getOpen={(field) => field.value !== Type.Removal}
        className='w-full'
      >
        <div className='mt-2 flex w-full flex-col gap-2'>
          <DraggableKeyboard />
          <div className='flex w-full gap-2'>
            <AddKeyboardButtonButton className='w-full' />
            <AddKeyboardRowButton className='w-full' />
          </div>
        </div>
      </FormToggleSection>
    </Block>
  );
}

export default KeyboardBlock;
