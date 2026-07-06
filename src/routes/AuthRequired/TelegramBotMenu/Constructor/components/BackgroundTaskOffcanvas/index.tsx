import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { defaultIntervalBlockFormValues } from './components/IntervalBlock/defaults';
import type { IntervalBlockFormValues } from './components/IntervalBlock/types';
import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import useFormikSubmit from '../../hooks/useFormikSubmit';

import {
  BackgroundTaskAPI,
  BackgroundTasksAPI,
  DiagramBackgroundTaskAPI,
} from 'api/telegram-bots/background-task';
import type { BackgroundTask } from 'api/telegram-bots/background-task/types';

import { useBackgroundTaskOffcanvasStore } from './store';

export interface FormValues extends NameBlockFormValues, IntervalBlockFormValues {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultIntervalBlockFormValues,
};

export interface BackgroundTaskOffcanvasProps extends OffcanvasInnerProps {}

function BackgroundTaskOffcanvas(props: BackgroundTaskOffcanvasProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'backgroundTaskOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const taskID = useBackgroundTaskOffcanvasStore((state) => state.taskID);
  const action = useBackgroundTaskOffcanvasStore((state) => state.action);
  const hideOffcanvas = useBackgroundTaskOffcanvasStore((state) => state.hideOffcanvas);

  const handleSubmit = useFormikSubmit<BackgroundTask, FormValues>(
    () => ({
      messages: {
        add: {
          success: t('messages.addBackgroundTask.success'),
          error: t('messages.addBackgroundTask.error'),
        },
        edit: {
          success: t('messages.editBackgroundTask.success'),
          error: t('messages.editBackgroundTask.error'),
        },
      },
      type: 'background_task',
      action,
      saveAPICall: (values) =>
        action === 'edit' && taskID
          ? BackgroundTaskAPI.update(telegramBotID, taskID, values)
          : BackgroundTasksAPI.create(telegramBotID, values),
      diagramAPICall: (id) => DiagramBackgroundTaskAPI.get(telegramBotID, id),
      onHide: () => hideOffcanvas(),
    }),
    [taskID, action, hideOffcanvas, i18n.language],
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

export default memo(BackgroundTaskOffcanvas);
