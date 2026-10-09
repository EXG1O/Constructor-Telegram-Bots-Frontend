import React, { lazy, type ReactElement, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Offcanvas, { type OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { defaultCommand } from './CommandBlock/defaults';
import { defaultMessage } from './MessageBlock/defaults';
import { defaultStartCommand } from './StartCommandBlock/defaults';
import { defaultType } from './TypeBlock/defaults';
import { Type } from './TypeBlock/types';
import { defaultWebhook } from './WebhookBlock/defaults';

import { TelegramBotsService } from 'api';

import composeHandlers from 'utils/composeHandlers';

import type { FormValues } from '..';
import { useTriggerOffcanvasStore } from '../store';

const OffcanvasContent = lazy(() => import('./OffcanvasContent'));

export interface OffcanvasInnerProps extends Omit<
  OffcanvasProps,
  'show' | 'loading' | 'children'
> {}

function OffcanvasInner({
  onHide,
  onHidden,
  ...props
}: OffcanvasInnerProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'triggerOffcanvas' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, setSubmitting, resetForm } =
    useFormikContext<FormValues>();

  const triggerID = useTriggerOffcanvasStore((state) => state.id);
  const action = useTriggerOffcanvasStore((state) => state.action);
  const show = useTriggerOffcanvasStore((state) => state.show);
  const hideOffcanvas = useTriggerOffcanvasStore((state) => state.hideOffcanvas);

  useEffect(() => {
    if (!triggerID) return;
    (async () => {
      setSubmitting(true);
      const { data, error } = await TelegramBotsService.getTrigger({
        path: { telegramBotId: botID, id: triggerID },
      });

      if (error || !data) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getTrigger.error'),
          level: 'error',
        });
        return;
      }

      const { id: _id, command, message, webhook, ...rest } = data;
      setValues({
        ...rest,

        type: command
          ? command.command === 'start'
            ? Type.StartCommand
            : Type.Command
          : message
            ? message.text
              ? Type.Message
              : Type.AnyMessage
            : webhook
              ? Type.Webhook
              : defaultType,
        start_command:
          command && command.command === 'start'
            ? {
                payload: command.payload ?? defaultStartCommand.payload,
                description: command.description ?? defaultStartCommand.description,
              }
            : defaultStartCommand,
        command:
          command && command.command !== 'start'
            ? {
                ...command,
                description: command.description ?? defaultCommand.description,
              }
            : defaultCommand,
        message: message
          ? { ...message, text: message.text ?? defaultMessage.text }
          : defaultMessage,
        webhook: webhook ?? defaultWebhook,

        show_start_command_payload: Boolean(command?.payload),
        show_start_command_description: Boolean(command?.description),

        show_command_description: Boolean(command?.description),
      });
      setSubmitting(false);
    })();
  }, [botID, triggerID]);

  return (
    <Offcanvas
      {...props}
      show={show}
      loading={isSubmitting}
      onHide={composeHandlers(hideOffcanvas, onHide)}
      onHidden={composeHandlers(resetForm, onHidden)}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {t('title', { context: action === 'edit' ? 'edit' : 'add' })}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Suspense fallback={!isSubmitting && <Offcanvas.Loading />}>
        <OffcanvasContent />
      </Suspense>
    </Offcanvas>
  );
}

export default OffcanvasInner;
