import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { createMessageToast } from 'components/ui/ToastContainer';

import {
  CommandBlockFormValues,
  defaultCommandBlockFormValues,
} from './components/CommandBlock';
import {
  defaultMessageBlockFormValues,
  MessageBlockFormValues,
} from './components/MessageBlock';
import OffcanvasInner, { OffcanvasInnerProps } from './components/OffcanvasInner';
import {
  defaultStartCommandBlockFormValues,
  StartCommandBlockFormValues,
} from './components/StartCommandBlock';
import {
  defaultTypeBlockFormValues,
  Type,
  TypeBlockFormValues,
} from './components/TypeBlock';

import { defaultNameBlockFormValues, NameBlockFormValues } from '../NameBlock';

import { TriggerAPI, TriggersAPI } from 'api/telegram-bots/trigger';
import { Data, Trigger } from 'api/telegram-bots/trigger/types';

import { useTriggerOffcanvasStore } from './store';

export interface FormValues
  extends NameBlockFormValues,
    TypeBlockFormValues,
    StartCommandBlockFormValues,
    CommandBlockFormValues,
    MessageBlockFormValues {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultTypeBlockFormValues,
  ...defaultStartCommandBlockFormValues,
  ...defaultCommandBlockFormValues,
  ...defaultMessageBlockFormValues,
};

export interface TriggerFormOffcanvasProps extends OffcanvasInnerProps {
  onAdd?: (trigger: Trigger) => void;
  onSave?: (trigger: Trigger) => void;
}

function TriggerOffcanvas({
  onAdd,
  onSave,
  ...props
}: TriggerFormOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'triggerOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const triggerID = useTriggerOffcanvasStore((state) => state.triggerID);
  const action = useTriggerOffcanvasStore((state) => state.action);
  const hideOffcanvas = useTriggerOffcanvasStore((state) => state.hideOffcanvas);

  async function handleSubmit(
    {
      type,
      start_command,
      command,
      message,
      show_start_command_payload,
      show_start_command_description,
      show_command_description,
      ...values
    }: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    const data: Data.TriggersAPI.Create | Data.TriggerAPI.Update = {
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
    };

    const response = await (triggerID
      ? TriggerAPI.update(telegramBot.id, triggerID, data)
      : TriggersAPI.create(telegramBot.id, data));

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
      }
      createMessageToast({
        message: t(`messages.${action}Trigger.error`),
        level: 'error',
      });
      return;
    }

    (triggerID ? onSave : onAdd)?.(response.json);
    hideOffcanvas();
    createMessageToast({
      message: t(`messages.${action}Trigger.success`),
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
      <OffcanvasInner {...props} />
    </Formik>
  );
}

export default memo(TriggerOffcanvas);
