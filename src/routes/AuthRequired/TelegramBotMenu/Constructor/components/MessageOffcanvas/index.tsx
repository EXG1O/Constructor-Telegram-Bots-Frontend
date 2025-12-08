import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { createMessageToast } from 'components/ui/ToastContainer';

import {
  defaultDocumentsBlockFormValues,
  DocumentsBlockFormValues,
} from './components/DocumentsBlock';
import {
  defaultImagesBlockFormValues,
  ImagesBlockFormValues,
} from './components/ImagesBlock';
import {
  defaultKeyboardBlockFormValues,
  KeyboardBlockFormValues,
} from './components/KeyboardBlock';
import OffcanvasInner, { OffcanvasInnerProps } from './components/OffcanvasInner';
import {
  defaultSettingsBlockFormValues,
  SettingsBlockFormValues,
} from './components/SettingsBlock';
import {
  defaultTextBlockFormValues,
  TextBlockFormValues,
} from './components/TextBlock';

import { defaultNameBlockFormValues, NameBlockFormValues } from '../NameBlock';

import { MessageAPI, MessagesAPI } from 'api/telegram-bots/message';
import { Data, Message } from 'api/telegram-bots/message/types';

import { useMessageOffcanvasStore } from './store';

export interface FormValues
  extends NameBlockFormValues,
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

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

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
                ...row.buttons.map(({ id, text, url }, buttonIndex) => ({
                  id,
                  row: rowIndex,
                  position: buttonIndex,
                  text,
                  url,
                })),
              );

              return buttons;
            }, []),
          }
        : null,
    };

    const response = await (action === 'add'
      ? MessagesAPI.create(telegramBot.id, data)
      : MessageAPI.update(telegramBot.id, messageID!, data));

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

    (action === 'add' ? onAdd : onSave)?.(response.json);
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
