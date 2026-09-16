import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { defaultDurationBlockFormValues } from './components/DurationBlock/defaults';
import type { DurationBlockFormValues } from './components/DurationBlock/types';
import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import useFormikSubmit from '../../hooks/useFormikSubmit';

import { DiagramTimerAPI, TimerAPI, TimersAPI } from 'api/telegram-bots/timer';
import type { Data, Timer } from 'api/telegram-bots/timer/types';

import { useTimerOffcanvasStore } from './store';

export interface FormValues extends NameBlockFormValues, DurationBlockFormValues {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultDurationBlockFormValues,
};

export interface TimerOffcanvasProps extends OffcanvasInnerProps {}

function TimerOffcanvas(props: TimerOffcanvasProps): ReactElement {
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'timerOffcanvas' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const timerID = useTimerOffcanvasStore((state) => state.timerID);
  const action = useTimerOffcanvasStore((state) => state.action);
  const hideOffcanvas = useTimerOffcanvasStore((state) => state.hideOffcanvas);

  const handleSubmit = useFormikSubmit<Timer, FormValues>(
    () => ({
      messages: {
        add: {
          success: t('messages.addTimer.success'),
          error: t('messages.addTimer.error'),
        },
        edit: {
          success: t('messages.editTimer.success'),
          error: t('messages.editTimer.error'),
        },
      },
      type: 'timer',
      action,
      saveAPICall: ({ duration, ...values }) => {
        const data: Data.TimersAPI.Create | Data.TimerAPI.Update = {
          ...values,
          duration_seconds: duration,
        };
        return action === 'edit' && timerID
          ? TimerAPI.update({ botID, id: timerID, data })
          : TimersAPI.create({ botID, data });
      },
      diagramAPICall: (id) => DiagramTimerAPI.get({ botID, id }),
      normalizeFieldName: (fieldName) =>
        fieldName.replace('duration_seconds', 'duration'),
      onHide: () => hideOffcanvas(),
    }),
    [i18n.language, botID, timerID, action, hideOffcanvas],
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

export default memo(TimerOffcanvas);
