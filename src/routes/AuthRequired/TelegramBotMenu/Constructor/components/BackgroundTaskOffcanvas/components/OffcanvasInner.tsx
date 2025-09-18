import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { FormValues } from '..';

import Offcanvas, { OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import OffcanvasContent from './OffcanvasContent';

import { BackgroundTaskAPI } from 'api/telegram-bots/background-task';

import { useBackgroundTaskOffcanvasStore } from '../store';

export interface OffcanvasInnerProps
  extends Omit<OffcanvasProps, 'show' | 'loading' | 'children'> {}

function OffcanvasInner({
  onHide,
  onHidden,
  ...props
}: OffcanvasInnerProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'backgroundTaskOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const taskID = useBackgroundTaskOffcanvasStore((state) => state.taskID);
  const show = useBackgroundTaskOffcanvasStore((state) => state.show);
  const loading = useBackgroundTaskOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useBackgroundTaskOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useBackgroundTaskOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (!taskID) return;
    (async () => {
      const response = await BackgroundTaskAPI.get(telegramBot.id, taskID);

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
  }, [telegramBot, taskID]);

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
      <OffcanvasContent />
    </Offcanvas>
  );
}

export default OffcanvasInner;
