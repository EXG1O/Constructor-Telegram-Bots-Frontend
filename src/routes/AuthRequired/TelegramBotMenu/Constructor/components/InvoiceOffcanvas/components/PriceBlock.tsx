import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormSimpleInputFeedback from 'components/shared/FormSimpleInputFeedback';
import Block, { BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

export interface Price {
  label: string;
  amount: string;
}

export interface PriceBlockFormValues {
  price: Price;
}

export interface PriceBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultPrice: Price = { label: '', amount: '' };
export const defaultPriceBlockFormValues: PriceBlockFormValues = {
  price: defaultPrice,
};

function PriceBlock({ className, ...props }: PriceBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'invoiceOffcanvas.priceBlock',
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
      <FormSimpleInputFeedback
        name='price.label'
        placeholder={t('label.inputPlaceholder')}
      />
      <FormSimpleInputFeedback
        name='price.amount'
        inputMode='numeric'
        placeholder={t('amount.inputPlaceholder')}
      />
    </Block>
  );
}

export default PriceBlock;
