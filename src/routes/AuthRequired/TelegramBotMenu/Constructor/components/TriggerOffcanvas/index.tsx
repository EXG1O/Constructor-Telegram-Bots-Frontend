import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, type FormikHelpers } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { createMessageToast } from 'components/ui/ToastContainer';

import { defaultCommandBlockFormValues } from './components/CommandBlock/defaults';
import type { CommandBlockFormValues } from './components/CommandBlock/types';
import { defaultMessageBlockFormValues } from './components/MessageBlock/defaults';
import type { MessageBlockFormValues } from './components/MessageBlock/types';
import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';
import { defaultStartCommandBlockFormValues } from './components/StartCommandBlock/defaults';
import type { StartCommandBlockFormValues } from './components/StartCommandBlock/types';
import { defaultTypeBlockFormValues } from './components/TypeBlock/defaults';
import { Type, type TypeBlockFormValues } from './components/TypeBlock/types';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import { TriggerAPI, TriggersAPI } from 'api/telegram-bots/trigger';
import type { Data, Trigger } from 'api/telegram-bots/trigger/types';

import { useTriggerOffcanvasStore } from './store';

export interface FormValues
  extends
    NameBlockFormValues,
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

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

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
      ? TriggerAPI.update(telegramBotID, triggerID, data)
      : TriggersAPI.create(telegramBotID, data));

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
