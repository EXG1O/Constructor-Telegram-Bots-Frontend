import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, type FormikHelpers } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { createMessageToast } from 'components/ui/ToastContainer';

import {
  defaultIntervalBlockFormValues,
  type IntervalBlockFormValues,
} from './components/IntervalBlock';
import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';

import { defaultNameBlockFormValues, type NameBlockFormValues } from '../NameBlock';

import {
  BackgroundTaskAPI,
  BackgroundTasksAPI,
} from 'api/telegram-bots/background-task';
import type { BackgroundTask } from 'api/telegram-bots/background-task/types';

import { useBackgroundTaskOffcanvasStore } from './store';

export interface FormValues extends NameBlockFormValues, IntervalBlockFormValues {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultIntervalBlockFormValues,
};

export interface BackgroundTaskOffcanvasProps extends OffcanvasInnerProps {
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

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const taskID = useBackgroundTaskOffcanvasStore((state) => state.taskID);
  const action = useBackgroundTaskOffcanvasStore((state) => state.action);
  const hideOffcanvas = useBackgroundTaskOffcanvasStore((state) => state.hideOffcanvas);

  async function handleSubmit(
    values: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    const response = await (taskID
      ? BackgroundTaskAPI.update(telegramBotID, taskID, values)
      : BackgroundTasksAPI.create(telegramBotID, values));

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
      }
      createMessageToast({
        message: t(`messages.${action}BackgroundTask.error`),
        level: 'error',
      });
      return;
    }

    (taskID ? onSave : onAdd)?.(response.json);
    hideOffcanvas();
    createMessageToast({
      message: t(`messages.${action}BackgroundTask.success`),
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

export default memo(BackgroundTaskOffcanvas);
