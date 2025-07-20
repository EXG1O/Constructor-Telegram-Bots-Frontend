import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormInputFeedback from 'components/shared/FormInputFeedback';
import Block, { BlockProps } from 'components/ui/Block';

import cn from 'utils/cn';

export type URL = string;

export interface URLBlockFormValues {
  url: URL;
}

export interface URLBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultURL: URL = '';
export const defaultURLBlockFormValues: URLBlockFormValues = {
  url: defaultURL,
};

function URLBlock({ className, ...props }: URLBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestOffcanvas.urlBlock',
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
      <FormInputFeedback name='url' placeholder={t('urlInput.placeholder')} />
    </Block>
  );
}

export default URLBlock;
