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

import { CommandAPI } from 'api/telegram-bots/command';

import { useCommandOffcanvasStore } from '../store';

export interface OffcanvasInnerProps
  extends Omit<OffcanvasProps, 'show' | 'loading' | 'children'> {}

function OffcanvasInner({
  onHide,
  onHidden,
  ...props
}: OffcanvasInnerProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const commandID = useCommandOffcanvasStore((state) => state.commandID);
  const show = useCommandOffcanvasStore((state) => state.show);
  const loading = useCommandOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useCommandOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useCommandOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (!commandID) return;
    (async () => {
      const response = await CommandAPI.get(telegramBot.id, commandID);

      if (!response.ok) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getCommand.error'),
          level: 'error',
        });
        return;
      }

      const { id, images, documents, keyboard, ...command } = response.json;

      setValues({
        ...command,

        images: images.length
          ? images
              .sort((a, b) => a.position - b.position)
              .map<Image>(({ id, name, size, url, from_url }) => ({
                id,
                key: crypto.randomUUID(),
                file: null,
                name: name ?? from_url!,
                size: size ?? 0,
                url: url ?? from_url!,
                from_url,
              }))
          : defaultImages,
        documents: documents.length
          ? documents
              .sort((a, b) => a.position - b.position)
              .map<Document>(({ id, name, size, url, from_url }) => ({
                id,
                key: crypto.randomUUID(),
                file: null,
                name: name ?? from_url!,
                size: size ?? 0,
                url: url ?? from_url!,
                from_url,
              }))
          : defaultDocuments,
        keyboard: keyboard
          ? {
              type: keyboard.type,
              rows: keyboard.buttons.reduce<KeyboardRow[]>(
                (rows, { id, row: rowIndex, position: buttonIndex, text, url }) => {
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
                  };

                  return rows;
                },
                [],
              ),
            }
          : defaultKeyboard,

        show_images_block: Boolean(images.length),
        show_documents_block: Boolean(documents.length),
        show_keyboard_block: Boolean(keyboard),
      });
      setLoading(false);
    })();
  }, [telegramBot, commandID]);

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
