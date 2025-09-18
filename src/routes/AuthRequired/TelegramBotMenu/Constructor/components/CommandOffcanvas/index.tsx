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
import {
  defaultMessageBlockFormValues,
  MessageBlockFormValues,
} from './components/MessageBlock';
import OffcanvasInner, { OffcanvasInnerProps } from './components/OffcanvasInner';
import {
  defaultSettingsBlockFormValues,
  SettingsBlockFormValues,
} from './components/SettingsBlock';

import { defaultNameBlockFormValues, NameBlockFormValues } from '../NameBlock';

import { CommandAPI, CommandsAPI } from 'api/telegram-bots/command';
import { Command, Data } from 'api/telegram-bots/command/types';

import { useCommandOffcanvasStore } from './store';

export interface FormValues
  extends NameBlockFormValues,
    SettingsBlockFormValues,
    ImagesBlockFormValues,
    DocumentsBlockFormValues,
    MessageBlockFormValues,
    KeyboardBlockFormValues {
  show_images_block: boolean;
  show_documents_block: boolean;
  show_keyboard_block: boolean;
}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultSettingsBlockFormValues,
  ...defaultImagesBlockFormValues,
  ...defaultDocumentsBlockFormValues,
  ...defaultMessageBlockFormValues,
  ...defaultKeyboardBlockFormValues,

  show_images_block: false,
  show_documents_block: false,
  show_keyboard_block: false,
};

export interface CommandOffcanvasProps extends OffcanvasInnerProps {
  onAdd?: (command: Command) => void;
  onSave?: (command: Command) => void;
}

function CommandOffcanvas({ onAdd, onSave }: CommandOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'commandOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const commandID = useCommandOffcanvasStore((state) => state.commandID);
  const action = useCommandOffcanvasStore((state) => state.action);
  const hideOffcanvas = useCommandOffcanvasStore((state) => state.hideOffcanvas);

  async function handleSubmit(
    {
      images,
      documents,
      keyboard,
      show_images_block,
      show_documents_block,
      show_keyboard_block,
      ...values
    }: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    const data: Data.CommandsAPI.Create | Data.CommandAPI.Update = {
      ...values,
      images:
        show_images_block && images.length
          ? images.map<Data.CommandsAPI.CreateCommandMedia>(
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
          ? documents.map<Data.CommandsAPI.CreateCommandMedia>(
              ({ id, file, from_url }, index) => ({
                id,
                position: index,
                file,
                from_url,
              }),
            )
          : null,
      keyboard: show_keyboard_block
        ? {
            type: keyboard.type,
            buttons: keyboard.rows.reduce<
              Data.CommandsAPI.CreateCommandKeyboardButton[]
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
      ? CommandsAPI.create(telegramBot.id, data)
      : CommandAPI.update(telegramBot.id, commandID!, data));

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
      }
      createMessageToast({
        message: t(`messages.${action}Command.error`),
        level: 'error',
      });
      return;
    }

    (action === 'add' ? onAdd : onSave)?.(response.json);
    hideOffcanvas();
    createMessageToast({
      message: t(`messages.${action}Command.success`),
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

export default memo(CommandOffcanvas);
