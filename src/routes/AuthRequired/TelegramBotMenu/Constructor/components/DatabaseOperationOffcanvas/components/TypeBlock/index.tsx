import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormSelectFeedback from 'components/shared/FormSelectFeedback';
import Block, { type BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

import { Type } from './types';

export interface TypeBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

function TypeBlock({ className, ...props }: TypeBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'databaseOperationOffcanvas',
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
        <option value={Type.Create}>{t('createBlock.title')}</option>
        <option value={Type.Update}>{t('updateBlock.title')}</option>
      </FormSelectFeedback>
    </Block>
  );
}

export default TypeBlock;
