import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormSimpleInputFeedback from 'components/shared/FormSimpleInputFeedback';
import TelegramSimpleInputLayout from 'components/shared/TelegramSimpleInputLayout';
import Block, { BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

export type Value = string;

export interface ValueBlockFormValues {
  value: Value;
}

export interface ValueBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultValue: Value = '';
export const defaultValueBlockFormValues: ValueBlockFormValues = {
  value: defaultValue,
};

function ValueBlock({ className, ...props }: ValueBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'temporaryVariableOffcanvas.valueBlock',
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
      <FormSimpleInputFeedback name='value' placeholder={t('inputPlaceholder')}>
        <TelegramSimpleInputLayout toolbarVariables />
      </FormSimpleInputFeedback>
    </Block>
  );
}

export default ValueBlock;
