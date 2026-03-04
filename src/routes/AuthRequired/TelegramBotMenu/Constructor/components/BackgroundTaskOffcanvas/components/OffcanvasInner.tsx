import React, { lazy, type ReactElement, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Offcanvas, { type OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { BackgroundTaskAPI } from 'api/telegram-bots/background-task';

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
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'backgroundTaskOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const taskID = useBackgroundTaskOffcanvasStore((state) => state.taskID);
  const show = useBackgroundTaskOffcanvasStore((state) => state.show);
  const loading = useBackgroundTaskOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useBackgroundTaskOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useBackgroundTaskOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (!taskID) return;
    (async () => {
      const response = await BackgroundTaskAPI.get(telegramBotID, taskID);

      if (!response.ok) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getBackgroundTask.error'),
          level: 'error',
        });
        return;
      }

      const { id, ...task } = response.json;

      setValues(task);
      setLoading(false);
    })();
  }, [telegramBotID, taskID]);

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
