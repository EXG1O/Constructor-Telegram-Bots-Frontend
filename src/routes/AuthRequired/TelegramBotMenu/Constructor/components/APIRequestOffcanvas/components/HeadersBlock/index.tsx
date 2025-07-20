import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/ui/Block';

import AddHeaderButton from './components/AddHeaderButton';
import HeaderList from './components/HeaderIList';

import cn from 'utils/cn';

export interface Header {
  key: string;
  value: string;
}
export type Headers = Header[];

export interface HeadersBlockFormValues {
  headers: Headers;
}

export interface HeadersBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultHeaders: Headers = [];
export const defaultHeadersBlockFormValues: HeadersBlockFormValues = {
  headers: defaultHeaders,
};

function HeadersBlock({ className, ...props }: HeadersBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestOffcanvas.headersBlock',
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
      <HeaderList />
      <AddHeaderButton />
    </Block>
  );
}

export default HeadersBlock;
