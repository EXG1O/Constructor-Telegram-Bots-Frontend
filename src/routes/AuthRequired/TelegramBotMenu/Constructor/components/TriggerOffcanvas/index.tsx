import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { defaultCommandBlockFormValues } from './components/CommandBlock/defaults';
import type { CommandBlockFormValues } from './components/CommandBlock/types';
import { defaultMessageBlockFormValues } from './components/MessageBlock/defaults';
import type { MessageBlockFormValues } from './components/MessageBlock/types';
import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';
import { defaultStartCommandBlockFormValues } from './components/StartCommandBlock/defaults';
import type { StartCommandBlockFormValues } from './components/StartCommandBlock/types';
import { defaultTypeBlockFormValues } from './components/TypeBlock/defaults';
import { Type, type TypeBlockFormValues } from './components/TypeBlock/types';
import { defaultWebhookBlockFormValues } from './components/WebhookBlock/defaults';
import type { WebhookBlockFormValues } from './components/WebhookBlock/types';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import useBlockFormikSubmit from '../../hooks/useBlockFormikSubmit';

import type { Trigger, TriggerRequestWritable } from 'api';
import { TelegramBotsService } from 'api';

import { NodeType } from '../../enums';
import { useTriggerOffcanvasStore } from './store';

export interface FormValues
  extends
    NameBlockFormValues,
    TypeBlockFormValues,
    StartCommandBlockFormValues,
    CommandBlockFormValues,
    MessageBlockFormValues,
    WebhookBlockFormValues {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultTypeBlockFormValues,
  ...defaultStartCommandBlockFormValues,
  ...defaultCommandBlockFormValues,
  ...defaultMessageBlockFormValues,
  ...defaultWebhookBlockFormValues,
};

export interface TriggerFormOffcanvasProps extends OffcanvasInnerProps {}

function TriggerOffcanvas(props: TriggerFormOffcanvasProps): ReactElement {
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'triggerOffcanvas' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const triggerID = useTriggerOffcanvasStore((state) => state.id);
  const action = useTriggerOffcanvasStore((state) => state.action);
  const showOffcanvas = useTriggerOffcanvasStore((state) => state.showOffcanvas);
  const hideOffcanvas = useTriggerOffcanvasStore((state) => state.hideOffcanvas);

  const handleSubmit = useBlockFormikSubmit<Trigger, FormValues>(
    () => ({
      messages: {
        add: {
          success: t('messages.addTrigger.success'),
          error: t('messages.addTrigger.error'),
        },
        edit: {
          success: t('messages.editTrigger.success'),
          error: t('messages.editTrigger.error'),
        },
      },
      type: NodeType.Trigger,
      action,
      saveBlock: ({
        type,
        start_command,
        command,
        message,
        show_start_command_payload,
        show_start_command_description,
        show_command_description,
        ...values
      }) => {
        const data: TriggerRequestWritable = {
          ...values,
          command:
            type === Type.StartCommand
              ? {
                  command: 'start',
                  payload: show_start_command_payload ? start_command.payload : null,
                  description: show_start_command_description
                    ? start_command.description
                    : null,
                }
              : type === Type.Command
                ? {
                    command: command.command,
                    payload: null,
                    description: show_command_description ? command.description : null,
                  }
                : null,
          message:
            type === Type.Message
              ? message
              : type === Type.AnyMessage
                ? { text: null }
                : null,
          webhook: type === Type.Webhook ? {} : null,
        };

        return action === 'edit' && triggerID
          ? TelegramBotsService.updateTrigger({
              path: { telegramBotId: botID, id: triggerID },
              body: data,
            })
          : TelegramBotsService.createTrigger({
              path: { telegramBotId: botID },
              body: data,
            });
      },
      getDiagramBlock: (id) =>
        TelegramBotsService.getDiagramTrigger({
          path: { telegramBotId: botID, id },
        }),
      onHide: (id, { type }) => {
        if (type !== Type.Webhook) {
          hideOffcanvas();
        }
      },
    }),
    [botID, triggerID, action, showOffcanvas, hideOffcanvas, i18n.language],
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

export default memo(TriggerOffcanvas);
