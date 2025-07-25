import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormSelectFeedback from 'components/shared/FormSelectFeedback';
import Block, { BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

export enum Type {
  Create = 'create',
  Update = 'update',
}

export interface TypeBlockFormValues {
  type: Type;
}

export interface TypeBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultType: Type = Type.Create;
export const defaultTypeBlockFormValues: TypeBlockFormValues = {
  type: defaultType,
};

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
