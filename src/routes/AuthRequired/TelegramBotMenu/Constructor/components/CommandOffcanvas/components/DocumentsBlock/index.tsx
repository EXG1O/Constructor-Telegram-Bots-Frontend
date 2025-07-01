import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/ui/Block';

import AddDocumentsButton from './components/AddDocumentsButton';
import DocumentList from './components/DocumentList';

import FormToggleSection from '../../../FormToggleSection';

import cn from 'utils/cn';

export interface Document extends Pick<File, 'name' | 'size'> {
  id?: number;
  key: string;
  name: string;
  size: number;
  file: File | null;
  from_url: string | null;
}

export type Documents = Document[];

export interface DocumentsBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

export const defaultDocuments: Documents = [];

function DocumentsBlock({ className, ...props }: DocumentsBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.documentsBlock',
  });

  return (
    <FormToggleSection name='show_documents_block'>
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
    </FormToggleSection>
  );
}

export default DocumentsBlock;
