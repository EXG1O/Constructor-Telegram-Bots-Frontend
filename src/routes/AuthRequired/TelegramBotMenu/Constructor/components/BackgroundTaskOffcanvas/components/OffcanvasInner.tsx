import React, { lazy, type ReactElement, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Offcanvas, { type OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { TelegramBotsService } from 'api';

import composeHandlers from 'utils/composeHandlers';

import type { FormValues } from '..';
import { useBackgroundTaskOffcanvasStore } from '../store';

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
    { keyPrefix: 'backgroundTaskOffcanvas' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, setSubmitting, resetForm } =
    useFormikContext<FormValues>();

  const taskID = useBackgroundTaskOffcanvasStore((state) => state.id);
  const action = useBackgroundTaskOffcanvasStore((state) => state.action);
  const show = useBackgroundTaskOffcanvasStore((state) => state.show);
  const hideOffcanvas = useBackgroundTaskOffcanvasStore((state) => state.hideOffcanvas);

  useEffect(() => {
    if (!taskID) return;
    (async () => {
      setSubmitting(true);
      const { data, error } = await TelegramBotsService.getBackgroundTask({
        path: { telegramBotId: botID, id: taskID },
      });

      if (error || !data) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getBackgroundTask.error'),
          level: 'error',
        });
        return;
      }

      const { id: _id, interval, ...rest } = data;
      setValues({ ...rest, interval: interval.toString() });
      setSubmitting(false);
    })();
  }, [botID, taskID]);

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
