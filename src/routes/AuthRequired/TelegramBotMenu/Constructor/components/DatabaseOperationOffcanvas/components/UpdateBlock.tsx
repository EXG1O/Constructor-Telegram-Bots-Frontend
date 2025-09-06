import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormCheckFeedback from 'components/shared/FormCheckFeedback';
import FormCodeInputFeedback from 'components/shared/FormCodeInputFeedback';
import FormSimpleInputFeedback from 'components/shared/FormSimpleInputFeedback';
import TelegramCodeInputLayout from 'components/shared/TelegramCodeInputLayout';
import Block, { BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

export interface UpdateOperation {
  overwrite: boolean;
  lookup_field_name: string;
  lookup_field_value: string;
  create_if_not_found: boolean;
  new_data: string;
}

export interface UpdateBlockFormValues {
  update_operation: UpdateOperation;
}

export interface UpdateBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultUpdateOperation: UpdateOperation = {
  overwrite: true,
  lookup_field_name: '',
  lookup_field_value: '',
  create_if_not_found: true,
  new_data: JSON.stringify({ key: 'value' }, undefined, 2),
};
export const defaultUpdateBlockFormValues: UpdateBlockFormValues = {
  update_operation: defaultUpdateOperation,
};

function UpdateBlock({ className, ...props }: UpdateBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'databaseOperationOffcanvas.updateBlock',
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
      <FormCheckFeedback
        type='switch'
        name='update_operation.overwrite'
        label={t('overwriteSwitch.label')}
      />
      <FormSimpleInputFeedback
        name='update_operation.lookup_field_name'
        placeholder={t('lookupFieldNameInput.placeholder')}
      />
      <FormSimpleInputFeedback
        name='update_operation.lookup_field_value'
        placeholder={t('lookupFieldValueInput.placeholder')}
      />
      <FormCheckFeedback
        type='switch'
        name='update_operation.create_if_not_found'
        label={t('createIfNotFoundSwitch.label')}
      />
      <FormCodeInputFeedback name='update_operation.new_data' language='json'>
        <TelegramCodeInputLayout toolbarVariables />
      </FormCodeInputFeedback>
    </Block>
  );
}

export default UpdateBlock;
