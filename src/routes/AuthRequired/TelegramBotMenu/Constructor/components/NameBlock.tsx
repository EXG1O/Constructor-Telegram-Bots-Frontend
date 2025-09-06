import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormSimpleInputFeedback from 'components/shared/FormSimpleInputFeedback';
import Block, { BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

export type Name = string;

export interface NameBlockFormValues {
  name: Name;
}

export interface NameBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultName: Name = '';
export const defaultNameBlockFormValues: NameBlockFormValues = {
  name: defaultName,
};

function NameBlock({ className, ...props }: NameBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'nameBlock',
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
      <FormSimpleInputFeedback name='name' placeholder={t('inputPlaceholder')} />
    </Block>
  );
}

export default NameBlock;
