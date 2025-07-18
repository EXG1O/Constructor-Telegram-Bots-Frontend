import React, { ReactElement, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Button from 'components/ui/Button';
import Offcanvas, { OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import CommandBlock, {
  CommandBlockFormValues,
  defaultCommand,
  defaultCommandBlockFormValues,
} from './components/CommandBlock';
import MessageBlock, {
  defaultMessage,
  defaultMessageBlockFormValues,
  MessageBlockFormValues,
} from './components/MessageBlock';
import StartCommandBlock, {
  defaultStartCommand,
  defaultStartCommandBlockFormValues,
  StartCommandBlockFormValues,
} from './components/StartCommandBlock';
import TypeBlock, {
  defaultType,
  defaultTypeBlockFormValues,
  Type,
  TypeBlockFormValues,
} from './components/TypeBlock';

import FormToggleSection from '../FormToggleSection';
import NameBlock, {
  defaultNameBlockFormValues,
  NameBlockFormValues,
} from '../NameBlock';

import { TriggerAPI, TriggersAPI } from 'api/telegram_bots/trigger';
import { Data, Trigger } from 'api/telegram_bots/trigger/types';

import { useTriggerOffcanvasStore } from './store';

export interface FormValues
  extends NameBlockFormValues,
    TypeBlockFormValues,
    StartCommandBlockFormValues,
    CommandBlockFormValues,
    MessageBlockFormValues {}

interface InnerTriggerOffcanvasProps
  extends Omit<OffcanvasProps, 'show' | 'loading' | 'children' | 'onHide'> {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultTypeBlockFormValues,
  ...defaultStartCommandBlockFormValues,
  ...defaultCommandBlockFormValues,
  ...defaultMessageBlockFormValues,
};

function InnerTriggerOffcanvas({
  onHidden,
  ...props
}: InnerTriggerOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'triggerOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const triggerID = useTriggerOffcanvasStore((state) => state.triggerID);
  const action = useTriggerOffcanvasStore((state) => state.action);
  const show = useTriggerOffcanvasStore((state) => state.show);
  const loading = useTriggerOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useTriggerOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useTriggerOffcanvasStore((state) => state.setLoading);

  const formID = useId();

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
  }, [triggerID]);

  function handleHidden(): void {
    resetForm();
    onHidden?.();
  }

  return (
    <Offcanvas
      {...props}
      show={show}
      loading={isSubmitting || loading}
      onHide={hideOffcanvas}
      onHidden={handleHidden}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{t('title', { context: action })}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body asChild>
        <Form id={formID}>
          <NameBlock className='mb-3' />
          <TypeBlock className='mb-3' />
          <FormToggleSection
            name='type'
            getOpen={(type) => type === Type.StartCommand}
            className='w-full'
          >
            <StartCommandBlock />
          </FormToggleSection>
          <FormToggleSection
            name='type'
            getOpen={(type) => type === Type.Command}
            className='w-full'
          >
            <CommandBlock />
          </FormToggleSection>
          <FormToggleSection
            name='type'
            getOpen={(type) => type === Type.Message}
            className='w-full'
          >
            <MessageBlock />
          </FormToggleSection>
        </Form>
      </Offcanvas.Body>
      <Offcanvas.Footer>
        <Button form={formID} type='submit' variant='success' className='w-full'>
          {t('actionButton', { context: action })}
        </Button>
      </Offcanvas.Footer>
    </Offcanvas>
  );
}

export interface TriggerFormOffcanvasProps extends InnerTriggerOffcanvasProps {
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
      message: type === Type.Message ? message : null,
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
      <InnerTriggerOffcanvas {...props} />
    </Formik>
  );
}

export default TriggerOffcanvas;
