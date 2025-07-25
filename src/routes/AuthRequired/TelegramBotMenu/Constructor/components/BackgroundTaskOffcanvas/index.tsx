import React, { ReactElement, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Button from 'components/ui/Button';
import Offcanvas, { OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import IntervalBlock, {
  defaultIntervalBlockFormValues,
  IntervalBlockFormValues,
} from './components/IntervalBlock';

import NameBlock, {
  defaultNameBlockFormValues,
  NameBlockFormValues,
} from '../NameBlock';

import {
  BackgroundTaskAPI,
  BackgroundTasksAPI,
} from 'api/telegram-bots/background-task';
import { BackgroundTask } from 'api/telegram-bots/background-task/types';

import { useBackgroundTaskOffcanvasStore } from './store';

export interface FormValues extends NameBlockFormValues, IntervalBlockFormValues {}

interface InnerBackgroundTaskOffcanvasProps
  extends Omit<OffcanvasProps, 'show' | 'loading' | 'children' | 'onHide'> {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultIntervalBlockFormValues,
};

function InnerBackgroundTaskOffcanvas({
  onHidden,
  ...props
}: InnerBackgroundTaskOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor);

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const taskID = useBackgroundTaskOffcanvasStore((state) => state.taskID);
  const type = useBackgroundTaskOffcanvasStore((state) => state.type);
  const show = useBackgroundTaskOffcanvasStore((state) => state.show);
  const loading = useBackgroundTaskOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useBackgroundTaskOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useBackgroundTaskOffcanvasStore((state) => state.setLoading);

  const formID = useId();

  useEffect(() => {
    if (!taskID) return;
    (async () => {
      const response = await BackgroundTaskAPI.get(telegramBot.id, taskID);

      if (!response.ok) {
        hideOffcanvas();
        createMessageToast({
          message: t('backgroundTaskOffcanvas.messages.getBackgroundTask.error'),
          level: 'error',
        });
        return;
      }

      const { id, ...task } = response.json;

      setValues(task);
      setLoading(false);
    })();
  }, [taskID]);

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
        <Offcanvas.Title>
          {t('backgroundTaskOffcanvas.title', { context: type })}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body asChild>
        <Form id={formID} className='flex flex-col gap-3'>
          <NameBlock />
          <IntervalBlock />
        </Form>
      </Offcanvas.Body>
      <Offcanvas.Footer>
        <Button form={formID} type='submit' variant='success' className='w-full'>
          {t('backgroundTaskOffcanvas.actionButton', { context: type })}
        </Button>
      </Offcanvas.Footer>
    </Offcanvas>
  );
}

export interface BackgroundTaskOffcanvasProps
  extends InnerBackgroundTaskOffcanvasProps {
  onAdd?: (task: BackgroundTask) => void;
  onSave?: (task: BackgroundTask) => void;
}

function BackgroundTaskOffcanvas({
  onAdd,
  onSave,
  ...props
}: BackgroundTaskOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'backgroundTaskOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const taskID = useBackgroundTaskOffcanvasStore((state) => state.taskID);
  const type = useBackgroundTaskOffcanvasStore((state) => state.type);
  const hideOffcanvas = useBackgroundTaskOffcanvasStore((state) => state.hideOffcanvas);

  async function handleSubmit(
    values: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    const response = await (taskID
      ? BackgroundTaskAPI.update(telegramBot.id, taskID, values)
      : BackgroundTasksAPI.create(telegramBot.id, values));

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
      }
      createMessageToast({
        message: t(`messages.${type}BackgroundTask.error`),
        level: 'error',
      });
      return;
    }

    (taskID ? onSave : onAdd)?.(response.json);
    hideOffcanvas();
    createMessageToast({
      message: t(`messages.${type}BackgroundTask.success`),
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
      <InnerBackgroundTaskOffcanvas {...props} />
    </Formik>
  );
}

export default BackgroundTaskOffcanvas;
