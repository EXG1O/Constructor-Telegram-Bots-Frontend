import React, { lazy, type ReactElement, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Offcanvas, { type OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { TimerAPI } from 'api/telegram-bots/timer';

import type { FormValues } from '..';
import { useTimerOffcanvasStore } from '../store';

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
    keyPrefix: 'timerOffcanvas',
  });

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const timerID = useTimerOffcanvasStore((state) => state.timerID);
  const action = useTimerOffcanvasStore((state) => state.action);
  const show = useTimerOffcanvasStore((state) => state.show);
  const loading = useTimerOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useTimerOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useTimerOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (!timerID) return;
    (async () => {
      const response = await TimerAPI.get({ botID, id: timerID });

      if (!response.ok) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getTimer.error'),
          level: 'error',
        });
        return;
      }

      const { id, duration_seconds, ...rest } = response.json;

      setValues({ ...rest, duration: duration_seconds });
      setLoading(false);
    })();
  }, [botID, timerID]);

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
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{t('title', { context: action })}</Offcanvas.Title>
      </Offcanvas.Header>
      <Suspense fallback={<Offcanvas.Loading />}>
        <OffcanvasContent />
      </Suspense>
    </Offcanvas>
  );
}

export default OffcanvasInner;
