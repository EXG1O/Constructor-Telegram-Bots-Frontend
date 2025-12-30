import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormSimpleInputFeedback from 'components/shared/FormSimpleInputFeedback';
import TelegramSimpleInputLayout from 'components/shared/TelegramSimpleInputLayout';
import Block, { BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

export type Title = string;

export interface TitleBlockFormValues {
  title: Title;
}

export interface TitleBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultTitle: Title = '';
export const defaultTitleBlockFormValues: TitleBlockFormValues = {
  title: defaultTitle,
};

function TitleBlock({ className, ...props }: TitleBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'invoiceOffcanvas.titleBlock',
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
      <FormSimpleInputFeedback name='title' placeholder={t('inputPlaceholder')}>
        <TelegramSimpleInputLayout toolbarVariables />
      </FormSimpleInputFeedback>
    </Block>
  );
}

export default TitleBlock;
