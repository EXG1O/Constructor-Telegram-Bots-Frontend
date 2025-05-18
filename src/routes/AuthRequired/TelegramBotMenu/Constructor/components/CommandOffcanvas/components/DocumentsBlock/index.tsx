import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Stack from 'components/ui/Stack';

import AddDocumentsButton from './components/AddDocumentsButton';
import DocumentList from './components/DocumentList';

import Block, { BlockProps } from '../../../Block';

export interface Document extends Pick<File, 'name' | 'size'> {
  id?: number;
  key: string;
  name: string;
  size: number;
  file: File | null;
  from_url: string | null;
}

export type Documents = Document[];

export type DocumentsBlockProps = Pick<BlockProps, 'className'>;

export const defaultDocuments: Documents = [];

function DocumentsBlock(props: DocumentsBlockProps): ReactElement<DocumentsBlockProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.documentsBlock',
  });

  return (
    <Block.Collapse name='show_documents_block'>
      <Block {...props} title={t('title')}>
        <Stack asChild className='gap-2'>
          <Block.Body>
            <DocumentList />
            <AddDocumentsButton />
          </Block.Body>
        </Stack>
      </Block>
    </Block.Collapse>
  );
}

export default memo(DocumentsBlock);
