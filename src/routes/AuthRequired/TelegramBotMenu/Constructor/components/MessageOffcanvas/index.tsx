import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, type FormikHelpers } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { createMessageToast } from 'components/ui/ToastContainer';

import {
  defaultDocumentsBlockFormValues,
  type DocumentsBlockFormValues,
} from './components/DocumentsBlock';
import {
  defaultImagesBlockFormValues,
  type ImagesBlockFormValues,
} from './components/ImagesBlock';
import {
  defaultKeyboardBlockFormValues,
  type KeyboardBlockFormValues,
} from './components/KeyboardBlock';
import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';
import {
  defaultSettingsBlockFormValues,
  type SettingsBlockFormValues,
} from './components/SettingsBlock';
import {
  defaultTextBlockFormValues,
  type TextBlockFormValues,
} from './components/TextBlock';

import { defaultNameBlockFormValues, type NameBlockFormValues } from '../NameBlock';

import { MessageAPI, MessagesAPI } from 'api/telegram-bots/message';
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

export interface MessageOffcanvasProps extends OffcanvasInnerProps {
  onAdd?: (message: Message) => void;
  onSave?: (message: Message) => void;
}

function MessageOffcanvas({ onAdd, onSave }: MessageOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);
  const setTelegramBot = useTelegramBotStore((state) => state.setTelegramBot);

  const messageID = useMessageOffcanvasStore((state) => state.messageID);
  const action = useMessageOffcanvasStore((state) => state.action);
  const hideOffcanvas = useMessageOffcanvasStore((state) => state.hideOffcanvas);

  async function handleSubmit(
    {
      images,
      documents,
      text,
      keyboard,
      show_images_block,
      show_documents_block,
      show_text_block,
      show_keyboard_block,
      ...values
    }: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    if (
      !show_images_block &&
      !show_documents_block &&
      !show_text_block &&
      !show_keyboard_block
    ) {
      createMessageToast({
        message: t(`messages.validation.error`, { context: 'noAddons' }),
        level: 'error',
      });
      return;
    }

    if (show_keyboard_block && !show_text_block) {
      createMessageToast({
        message: t(`messages.validation.error`, { context: 'keyboardRequiresText' }),
        level: 'error',
      });
      return;
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

    const response = await (action === 'add'
      ? MessagesAPI.create(telegramBotID, data)
      : MessageAPI.update(telegramBotID, messageID!, data));

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
      }
      createMessageToast({
        message: t(`messages.${action}Message.error`),
        level: 'error',
      });
      return;
    }

    const { usedStorageSize } = useMessageOffcanvasStore.getState();

    (action === 'add' ? onAdd : onSave)?.(response.json);
    setTelegramBot((telegramBot) => {
      telegramBot!.used_storage_size = usedStorageSize;
    });
    hideOffcanvas();
    createMessageToast({
      message: t(`messages.${action}Message.success`),
      level: 'success',
    });
  }

  return (
    <Formik
      initialValues={defaultFormValues}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      <OffcanvasInner />
    </Formik>
  );
}

export default memo(MessageOffcanvas);
