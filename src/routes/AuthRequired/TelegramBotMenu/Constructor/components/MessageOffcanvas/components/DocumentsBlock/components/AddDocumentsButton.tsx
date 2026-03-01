import React, { ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import { Document, Documents } from '..';

import Button, { ButtonProps } from 'components/ui/Button';
import { createMessageToast } from 'components/ui/ToastContainer';

import { useMessageOffcanvasStore } from '../../../store';

export interface AddDocumentsButtonProps
  extends Omit<ButtonProps, 'size' | 'variant' | 'htmlFor'> {}

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

  const id = useId();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files) return;

    const newDocuments: File[] = Object.values(event.target.files);
    event.target.value = '';

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
  }

  return (
    <>
      <input id={id} type='file' multiple hidden onChange={handleChange} />
      <Button {...props} asChild size='sm' variant='dark'>
        <label htmlFor={id}>{t('text')}</label>
      </Button>
    </>
  );
}

export default AddDocumentsButton;
