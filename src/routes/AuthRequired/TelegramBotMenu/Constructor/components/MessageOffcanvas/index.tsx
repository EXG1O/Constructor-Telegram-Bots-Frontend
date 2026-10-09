import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import type { RouteID } from 'routes';
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

import useBlockFormikSubmit from '../../hooks/useBlockFormikSubmit';

import type { Message, MessageKeyboardType, MessageRequestWritable } from 'api';
import { TelegramBotsService } from 'api';
import formDataBodySerializer from 'api/utils/formDataBodySerializer';

import { NodeType } from '../../enums';
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
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'messageOffcanvas' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);
  const setTelegramBot = useTelegramBotStore((state) => state.setTelegramBot);

  const messageID = useMessageOffcanvasStore((state) => state.id);
  const action = useMessageOffcanvasStore((state) => state.action);
  const hideOffcanvas = useMessageOffcanvasStore((state) => state.hideOffcanvas);

  const handleSubmit = useBlockFormikSubmit<Message, FormValues>(
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
      type: NodeType.Message,
      action,
      saveBlock: async ({
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

        const data: MessageRequestWritable = {
          ...values,
          images:
            show_images_block && images.length
              ? images.map(({ id, file, from_url }, index) => ({
                  id,
                  position: index,
                  file,
                  from_url,
                }))
              : null,
          documents:
            show_documents_block && documents.length
              ? documents.map(({ id, file, from_url }, index) => ({
                  id,
                  position: index,
                  file,
                  from_url,
                }))
              : null,
          text: show_text_block ? text : null,
          keyboard: show_keyboard_block
            ? {
                type: keyboard.type as MessageKeyboardType,
                buttons: keyboard.rows.reduce<any[]>((buttons, row, rowIndex) => {
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
          ? TelegramBotsService.updateMessage({
              ...formDataBodySerializer,
              path: { telegramBotId: botID, id: messageID },
              body: data,
            })
          : TelegramBotsService.createMessage({
              ...formDataBodySerializer,
              path: { telegramBotId: botID },
              body: data,
            }));

        if (response) {
          const { usedStorageSize } = useMessageOffcanvasStore.getState();

          setTelegramBot((telegramBot) => {
            telegramBot!.used_storage_size = usedStorageSize;
          });
        }

        return response;
      },
      getDiagramBlock: (id) =>
        TelegramBotsService.getDiagramMessage({
          path: { telegramBotId: botID, id },
        }),
      onHide: () => hideOffcanvas(),
    }),
    [botID, messageID, action, hideOffcanvas, i18n.language],
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
