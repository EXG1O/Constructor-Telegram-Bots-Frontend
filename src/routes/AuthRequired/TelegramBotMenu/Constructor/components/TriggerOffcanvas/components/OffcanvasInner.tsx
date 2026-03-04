import React, { lazy, type ReactElement, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Offcanvas, { type OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { defaultCommand } from './CommandBlock/defaults';
import { defaultMessage } from './MessageBlock/defaults';
import { defaultStartCommand } from './StartCommandBlock/defaults';
import { defaultType } from './TypeBlock/defaults';
import { Type } from './TypeBlock/types';

import { TriggerAPI } from 'api/telegram-bots/trigger';

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
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'triggerOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const triggerID = useTriggerOffcanvasStore((state) => state.triggerID);
  const show = useTriggerOffcanvasStore((state) => state.show);
  const loading = useTriggerOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useTriggerOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useTriggerOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (!triggerID) return;
    (async () => {
      const response = await TriggerAPI.get(telegramBotID, triggerID);

      if (!response.ok) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getTrigger.error'),
          level: 'error',
        });
        return;
      }

      const { id, command, message, ...trigger } = response.json;

      setValues({
        ...trigger,

        type: command
          ? command.command === 'start'
            ? Type.StartCommand
            : Type.Command
          : message
            ? message.text
              ? Type.Message
              : Type.AnyMessage
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

        show_start_command_payload: Boolean(command?.payload),
        show_start_command_description: Boolean(command?.description),

        show_command_description: Boolean(command?.description),
      });
      setLoading(false);
    })();
  }, [telegramBotID, triggerID]);

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
      <Suspense fallback={<Offcanvas.Loading />}>
        <OffcanvasContent />
      </Suspense>
    </Offcanvas>
  );
}

export default OffcanvasInner;
