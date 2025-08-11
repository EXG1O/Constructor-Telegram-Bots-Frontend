import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormCodeInputFeedback from 'components/shared/FormCodeInputFeedback';
import Block, { BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

export interface CreateOperation {
  data: string;
}

export interface CreateBlockFormValues {
  create_operation: CreateOperation;
}

export interface CreateBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultCreateOperation: CreateOperation = {
  data: JSON.stringify({ key: 'value' }, undefined, 2),
};
export const defaultCreateBlockFormValues: CreateBlockFormValues = {
  create_operation: defaultCreateOperation,
};

function CreateBlock({ className, ...props }: CreateBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'databaseOperationOffcanvas.createBlock',
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
      <FormCodeInputFeedback name='create_operation.data' language='json' />
    </Block>
  );
}

export default CreateBlock;
