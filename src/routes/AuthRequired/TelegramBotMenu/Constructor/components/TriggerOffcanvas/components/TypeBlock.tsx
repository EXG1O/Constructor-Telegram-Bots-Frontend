import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormSelectFeedback from 'components/shared/FormSelectFeedback';
import Block, { BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

export enum Type {
  StartCommand = 'startCommand',
  Command = 'command',
  Message = 'message',
}

export interface TypeBlockFormValues {
  type: Type;
}

export interface TypeBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultType: Type = Type.StartCommand;
export const defaultTypeBlockFormValues: TypeBlockFormValues = {
  type: defaultType,
};

function TypeBlock({ className, ...props }: TypeBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'triggerOffcanvas',
  });

  return (
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-2', className)}
    >
      <Block.Title>
        <h3 className='text-lg font-medium'>{t('typeBlock.title')}</h3>
      </Block.Title>
      <FormSelectFeedback name='type'>
        <option value={Type.StartCommand}>{t('startCommandBlock.title')}</option>
        <option value={Type.Command}>{t('commandBlock.title')}</option>
        <option value={Type.Message}>{t('messageBlock.title')}</option>
      </FormSelectFeedback>
    </Block>
  );
}

export default TypeBlock;
