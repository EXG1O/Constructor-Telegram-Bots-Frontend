import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { FormValues } from '..';

import Offcanvas, { OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { defaultDocuments, Document } from './DocumentsBlock';
import { defaultImages, Image } from './ImagesBlock';
import { defaultKeyboard } from './KeyboardBlock';
import { KeyboardRow } from './KeyboardBlock/components/Keyboard';
import OffcanvasContent from './OffcanvasContent';
import { defaultText } from './TextBlock';

import { MessageAPI } from 'api/telegram-bots/message';
import fetchFile from 'api/utils/fetchFile';

import { useMessageOffcanvasStore } from '../store';

export interface OffcanvasInnerProps
  extends Omit<OffcanvasProps, 'show' | 'loading' | 'children'> {}

function OffcanvasInner({
  onHide,
  onHidden,
  ...props
}: OffcanvasInnerProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const messageID = useMessageOffcanvasStore((state) => state.messageID);
  const show = useMessageOffcanvasStore((state) => state.show);
  const loading = useMessageOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useMessageOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useMessageOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (!messageID) return;
    (async () => {
      const response = await MessageAPI.get(telegramBot.id, messageID);

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

      setValues({
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
      });
      setLoading(false);
    })();
  }, [telegramBot, messageID]);

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
