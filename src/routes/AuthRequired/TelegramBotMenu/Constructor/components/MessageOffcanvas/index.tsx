import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { createMessageToast } from 'components/ui/ToastContainer';

import { defaultDocumentsBlockFormValues } from './components/DocumentsBlock/defaults';
import type { DocumentsBlockFormValues } from './components/DocumentsBlock/types';
import { defaultImagesBlockFormValues } from './components/ImagesBlock/defaults';
import type { ImagesBlockFormValues } from './components/ImagesBlock/types';
import { defaultKeyboardBlockFormValues } from './components/KeyboardBlock/defaults';
import type { KeyboardBlockFormValues } from './components/KeyboardBlock/types';
import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';
import { defaultSettingsBlockFormValues } from './components/SettingsBlock/defaults';
import type { SettingsBlockFormValues } from './components/SettingsBlock/types';
import { defaultTextBlockFormValues } from './components/TextBlock/defaults';
import type { TextBlockFormValues } from './components/TextBlock/types';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import useFormikSubmit from '../../hooks/useFormikSubmit';

import { DiagramMessageAPI, MessageAPI, MessagesAPI } from 'api/telegram-bots/message';
import type { Data, Message } from 'api/telegram-bots/message/types';

import { useMessageOffcanvasStore } from './store';

export interface FormValues
  extends
    NameBlockFormValues,
    SettingsBlockFormValues,
    ImagesBlockFormValues,
    DocumentsBlockFormValues,
    TextBlockFormValues,
    KeyboardBlockFormValues {
  show_images_block: boolean;
  show_documents_block: boolean;
  show_text_block: boolean;
  show_keyboard_block: boolean;
}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultSettingsBlockFormValues,
  ...defaultImagesBlockFormValues,
  ...defaultDocumentsBlockFormValues,
  ...defaultTextBlockFormValues,
  ...defaultKeyboardBlockFormValues,

  show_images_block: false,
  show_documents_block: false,
  show_text_block: false,
  show_keyboard_block: false,
};

export interface MessageOffcanvasProps extends OffcanvasInnerProps {}

function MessageOffcanvas(props: MessageOffcanvasProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);
  const setTelegramBot = useTelegramBotStore((state) => state.setTelegramBot);

  const messageID = useMessageOffcanvasStore((state) => state.messageID);
  const action = useMessageOffcanvasStore((state) => state.action);
  const hideOffcanvas = useMessageOffcanvasStore((state) => state.hideOffcanvas);

  const handleSubmit = useFormikSubmit<Message, FormValues>(
    () => ({
      messages: {
        add: {
          success: t('messages.addMessage.success'),
          error: t('messages.addMessage.error'),
        },
        edit: {
          success: t('messages.editMessage.success'),
          error: t('messages.editMessage.error'),
        },
      },
      type: 'message',
      action,
      saveAPICall: async ({
        images,
        documents,
        text,
        keyboard,
        show_images_block,
        show_documents_block,
        show_text_block,
        show_keyboard_block,
        ...values
      }) => {
        if (
          !show_images_block &&
          !show_documents_block &&
          !show_text_block &&
          !show_keyboard_block
        ) {
          createMessageToast({
            message: t('messages.validation.error', { context: 'noAddons' }),
            level: 'error',
          });
          return null;
        }

        if (show_keyboard_block && !show_text_block) {
          createMessageToast({
            message: t('messages.validation.error', {
              context: 'keyboardRequiresText',
            }),
            level: 'error',
          });
          return null;
        }

        const data: Data.MessagesAPI.Create | Data.MessageAPI.Update = {
          ...values,
          images:
            show_images_block && images.length
              ? images.map<Data.MessagesAPI.CreateMessageMedia>(
                  ({ id, file, from_url }, index) => ({
                    id,
                    position: index,
                    file,
                    from_url,
                  }),
                )
              : null,
          documents:
            show_documents_block && documents.length
              ? documents.map<Data.MessagesAPI.CreateMessageMedia>(
                  ({ id, file, from_url }, index) => ({
                    id,
                    position: index,
                    file,
                    from_url,
                  }),
                )
              : null,
          text: show_text_block ? text : null,
          keyboard: show_keyboard_block
            ? {
                type: keyboard.type,
                buttons: keyboard.rows.reduce<
                  Data.MessagesAPI.CreateMessageKeyboardButton[]
                >((buttons, row, rowIndex) => {
                  buttons.push(
                    ...row.buttons.map(({ id, text, url, style }, buttonIndex) => ({
                      id,
                      row: rowIndex,
                      position: buttonIndex,
                      text,
                      url,
                      style,
                    })),
                  );

                  return buttons;
                }, []),
              }
            : null,
        };

        const response = await (action === 'edit' && messageID
          ? MessageAPI.update(telegramBotID, messageID, data)
          : MessagesAPI.create(telegramBotID, data));

        if (response.ok) {
          const { usedStorageSize } = useMessageOffcanvasStore.getState();

          setTelegramBot((telegramBot) => {
            telegramBot!.used_storage_size = usedStorageSize;
          });
        }

        return response;
      },
      diagramAPICall: (id) => DiagramMessageAPI.get(telegramBotID, id),
      onHide: () => hideOffcanvas(),
    }),
    [messageID, action, hideOffcanvas, i18n.language],
  );

  return (
    <Formik
      initialValues={defaultFormValues}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      <OffcanvasInner {...props} />
    </Formik>
  );
}

export default memo(MessageOffcanvas);
