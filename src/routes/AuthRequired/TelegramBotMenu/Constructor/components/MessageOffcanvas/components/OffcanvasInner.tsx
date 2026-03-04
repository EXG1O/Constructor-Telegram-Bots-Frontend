import React, { type ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Offcanvas, { type OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { defaultDocuments } from './DocumentsBlock/defaults';
import type { Document } from './DocumentsBlock/types';
import { defaultImages } from './ImagesBlock/defaults';
import type { Image } from './ImagesBlock/types';
import type { KeyboardRow } from './KeyboardBlock/components/DraggableKeyboard';
import { defaultKeyboard } from './KeyboardBlock/defaults';
import OffcanvasContent from './OffcanvasContent';
import { defaultText } from './TextBlock/defaults';

import { MessageAPI } from 'api/telegram-bots/message';
import fetchFile from 'api/utils/fetchFile';

import calcMediaSize from '../../../utils/calcMediaSize';
import type { FormValues } from '..';
import { useMessageOffcanvasStore } from '../store';

export interface OffcanvasInnerProps extends Omit<
  OffcanvasProps,
  'show' | 'loading' | 'children'
> {}

function OffcanvasInner({
  onHide,
  onHidden,
  ...props
}: OffcanvasInnerProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const messageID = useMessageOffcanvasStore((state) => state.messageID);
  const show = useMessageOffcanvasStore((state) => state.show);
  const loading = useMessageOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useMessageOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useMessageOffcanvasStore((state) => state.setLoading);
  const setUsedStorageSize = useMessageOffcanvasStore(
    (state) => state.setUsedStorageSize,
  );

  useEffect(() => {
    if (!messageID) return;
    (async () => {
      const response = await MessageAPI.get(telegramBotID, messageID);

      if (!response.ok) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getMessage.error'),
          level: 'error',
        });
        return;
      }

      const { id, text, images, documents, keyboard, ...message } = response.json;

      const [loadedImages, loadedDocuments] = await Promise.all([
        Promise.all(
          images
            .sort((a, b) => a.position - b.position)
            .map<Promise<Image>>(async ({ id, name, url, from_url }) => {
              const file: File | null = url && name ? await fetchFile(url, name) : null;

              return {
                id,
                key: crypto.randomUUID(),
                file,
                file_url: file && URL.createObjectURL(file),
                from_url,
              };
            }),
        ),
        Promise.all(
          documents
            .sort((a, b) => a.position - b.position)
            .map<Promise<Document>>(async ({ id, name, url, from_url }) => ({
              id,
              key: crypto.randomUUID(),
              file: url && name ? await fetchFile(url, name) : null,
              from_url,
            })),
        ),
      ]);
      const values: FormValues = {
        ...message,

        images: loadedImages.length ? loadedImages : defaultImages,
        documents: loadedDocuments.length ? loadedDocuments : defaultDocuments,
        text: text ?? defaultText,
        keyboard: keyboard
          ? {
              type: keyboard.type,
              rows: keyboard.buttons.reduce<KeyboardRow[]>(
                (
                  rows,
                  { id, row: rowIndex, position: buttonIndex, text, url, style },
                ) => {
                  if (!rows[rowIndex]) {
                    rows[rowIndex] = {
                      draggableId: crypto.randomUUID(),
                      buttons: [],
                    };
                  }

                  rows[rowIndex].buttons[buttonIndex] = {
                    id,
                    draggableId: crypto.randomUUID(),
                    text,
                    url,
                    style,
                  };

                  return rows;
                },
                [],
              ),
            }
          : defaultKeyboard,

        show_images_block: Boolean(images.length),
        show_documents_block: Boolean(documents.length),
        show_text_block: text !== null,
        show_keyboard_block: Boolean(keyboard),
      };

      setValues(values);
      setUsedStorageSize(
        useTelegramBotStore.getState().telegramBot!.used_storage_size -
          ((values.show_images_block ? calcMediaSize(values.images) : 0) +
            (values.show_documents_block ? calcMediaSize(values.documents) : 0)),
      );
      setLoading(false);
    })();
  }, [telegramBotID, messageID]);

  function handleHide(): void {
    hideOffcanvas();
    onHide?.();
  }

  function handleHidden(): void {
    resetForm();
    onHidden?.();
  }

  return (
    <Offcanvas
      {...props}
      show={show}
      loading={isSubmitting || loading}
      onHide={handleHide}
      onHidden={handleHidden}
    >
      <OffcanvasContent />
    </Offcanvas>
  );
}

export default OffcanvasInner;
