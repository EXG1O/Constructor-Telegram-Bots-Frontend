import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import Button, { type ButtonProps } from 'components/ui/Button';
import { createMessageToast } from 'components/ui/ToastContainer';

import MediaPopover from '../../../../MediaPopover';
import type { ResultData } from '../../../../MediaPopover/types';

import { useMessageOffcanvasStore } from '../../../store';
import type { Document, Documents } from '../types';

export interface AddDocumentsButtonProps extends Omit<
  ButtonProps,
  'size' | 'variant' | 'htmlFor'
> {}

function AddDocumentsButton(props: AddDocumentsButtonProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas.documentsBlock.addDocumentsButton',
  });

  const getRemainingStorageSize = useMessageOffcanvasStore(
    (state) => state.getRemainingStorageSize,
  );
  const setUsedStorageSize = useMessageOffcanvasStore(
    (state) => state.setUsedStorageSize,
  );

  const [{ value: documents }, _meta, { setValue: setDocuments }] =
    useField<Documents>('documents');

  function handleAdd({ files, url }: ResultData): void {
    if (files && files.length) {
      const newDocuments: File[] = files;

      let availableStorageSize: number = getRemainingStorageSize();
      let newDocumentsTotalSize: number = 0;

      setDocuments([
        ...documents,
        ...newDocuments
          .filter((newDocument) => {
            if (newDocument.size > 2621440) {
              createMessageToast({
                message: t('messages.addDocuments.error', {
                  context: 'tooLarge',
                  name: newDocument.name,
                }),
                level: 'error',
              });
              return false;
            }

            if (availableStorageSize - newDocument.size < 0) {
              createMessageToast({
                message: t('messages.addDocuments.error', {
                  context: 'notEnoughStorage',
                  name: newDocument.name,
                }),
                level: 'error',
              });
              return false;
            }

            availableStorageSize -= newDocument.size;
            newDocumentsTotalSize += newDocument.size;

            return true;
          })
          .map<Document>((file) => ({
            key: crypto.randomUUID(),
            file,
            from_url: null,
          })),
      ]);
      setUsedStorageSize((prev) => prev + newDocumentsTotalSize);
    } else if (url) {
      setDocuments([
        ...documents,
        { key: crypto.randomUUID(), file: null, from_url: url },
      ]);
    }
  }

  return (
    <MediaPopover onAdd={handleAdd}>
      <MediaPopover.Trigger asChild>
        <Button {...props} size='sm' variant='dark'>
          {t('text')}
        </Button>
      </MediaPopover.Trigger>
    </MediaPopover>
  );
}

export default AddDocumentsButton;
