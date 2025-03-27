import React, { memo, ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import { Document, Documents } from '..';

import Button, { ButtonProps } from 'components/Button';
import { createMessageToast } from 'components/ToastContainer';

import useTelegramBotStorage from '../../../hooks/useTelegramBotStorage';

export type AddDocumentsButtonProps = Pick<ButtonProps, 'className'>;

function AddDocumentsButton(
  props: AddDocumentsButtonProps,
): ReactElement<AddDocumentsButtonProps> {
  const id = useId();

  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas.documentsBlock.addDocumentsButton',
  });

  const [{ value: documents }, _meta, { setValue: setDocuments }] =
    useField<Documents>('documents');

  const { remainingStorageSize } = useTelegramBotStorage();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (!event.target.files) return;

    const newDocuments: File[] = Object.values(event.target.files);

    event.target.value = '';

    let availableStorageSize = remainingStorageSize;

    setDocuments([
      ...documents,
      ...newDocuments
        .filter((newDocument) => {
          if (
            documents.some(
              (document) =>
                newDocument.name === document.name &&
                newDocument.size === document.size,
            )
          ) {
            return false;
          }

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

          return true;
        })
        .map<Document>((file) => ({
          key: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          file,
          from_url: null,
        })),
    ]);
  }

  return (
    <>
      <input id={id} type='file' multiple hidden onChange={handleChange} />
      <Button {...props} as='label' htmlFor={id} size='sm' variant='dark'>
        {t('text')}
      </Button>
    </>
  );
}

export default memo(AddDocumentsButton);
