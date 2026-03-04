import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block, { type BlockProps } from 'components/ui/Block';

import AddDocumentsButton from './components/AddDocumentsButton';
import DocumentList from './components/DocumentList';

import cn from 'utils/cn';

export interface DocumentsBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

function DocumentsBlock({ className, ...props }: DocumentsBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.documentsBlock',
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
      <DocumentList />
      <AddDocumentsButton />
    </Block>
  );
}

export default DocumentsBlock;
