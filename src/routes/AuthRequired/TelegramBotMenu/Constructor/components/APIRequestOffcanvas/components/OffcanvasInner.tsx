import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { FormValues } from '..';

import Offcanvas, { OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { defaultBody } from './BodyBlock';
import { defaultHeaders } from './HeadersBlock';
import OffcanvasContent from './OffcanvasContent';

import { APIRequestAPI } from 'api/telegram-bots/api-request';

import { useAPIRequestOffcanvasStore } from '../store';

export interface OffcanvasInnerProps
  extends Omit<OffcanvasProps, 'show' | 'loading' | 'children'> {}

function OffcanvasInner({
  onHide,
  onHidden,
  ...props
}: OffcanvasInnerProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const requestID = useAPIRequestOffcanvasStore((state) => state.requestID);
  const show = useAPIRequestOffcanvasStore((state) => state.show);
  const loading = useAPIRequestOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useAPIRequestOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useAPIRequestOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (!requestID) return;
    (async () => {
      const response = await APIRequestAPI.get(telegramBot.id, requestID);

      if (!response.ok) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getAPIRequest.error'),
          level: 'error',
        });
        return;
      }

      const { id, headers, body, ...request } = response.json;

      setValues({
        ...request,
        headers: headers
          ? Object.entries(headers).map(([key, value]) => ({ key, value }))
          : defaultHeaders,
        body: body ? JSON.stringify(body, null, 2) : defaultBody,
      });
      setLoading(false);
    })();
  }, [telegramBot, requestID]);

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
