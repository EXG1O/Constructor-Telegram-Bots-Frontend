import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { FormValues } from '..';

import Offcanvas, { OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { defaultCommand } from './CommandBlock';
import { defaultMessage } from './MessageBlock';
import OffcanvasContent from './OffcanvasContent';
import { defaultStartCommand } from './StartCommandBlock';
import { defaultType, Type } from './TypeBlock';

import { TriggerAPI } from 'api/telegram-bots/trigger';

import { useTriggerOffcanvasStore } from '../store';

export interface OffcanvasInnerProps
  extends Omit<OffcanvasProps, 'show' | 'loading' | 'children'> {}

function OffcanvasInner({
  onHide,
  onHidden,
  ...props
}: OffcanvasInnerProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'triggerOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const triggerID = useTriggerOffcanvasStore((state) => state.triggerID);
  const show = useTriggerOffcanvasStore((state) => state.show);
  const loading = useTriggerOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useTriggerOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useTriggerOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (!triggerID) return;
    (async () => {
      const response = await TriggerAPI.get(telegramBot.id, triggerID);

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
            ? Type.Message
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
        message: message ?? defaultMessage,

        show_start_command_payload: Boolean(command?.payload),
        show_start_command_description: Boolean(command?.description),

        show_command_description: Boolean(command?.description),
      });
      setLoading(false);
    })();
  }, [telegramBot, triggerID]);

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
