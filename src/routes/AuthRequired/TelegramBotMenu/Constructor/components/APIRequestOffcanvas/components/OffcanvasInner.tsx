import React, { lazy, type ReactElement, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Offcanvas, { type OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { defaultBody } from './BodyBlock/defaults';
import { defaultHeaders } from './HeadersBlock/defaults';
import { defaultMethod } from './MethodBlock/defaults';

import { TelegramBotsService } from 'api';

import type { FormValues } from '..';
import { useAPIRequestOffcanvasStore } from '../store';

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
    { keyPrefix: 'apiRequestOffcanvas' },
  );

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const requestID = useAPIRequestOffcanvasStore((state) => state.requestID);
  const action = useAPIRequestOffcanvasStore((state) => state.action);
  const show = useAPIRequestOffcanvasStore((state) => state.show);
  const loading = useAPIRequestOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useAPIRequestOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useAPIRequestOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (!requestID) return;
    (async () => {
      const { data, error } = await TelegramBotsService.getApiRequest({
        path: { telegramBotId: telegramBotID, id: requestID },
      });

      if (error || !data) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getAPIRequest.error'),
          level: 'error',
        });
        return;
      }

      const { id: _id, headers, body, ...request } = data;

      setValues({
        ...request,
        method: request.method || defaultMethod,
        headers: headers
          ? Object.entries(headers).map(([key, value]) => ({
              key,
              value: value as string,
            }))
          : defaultHeaders,
        body: body ? JSON.stringify(body, null, 2) : defaultBody,
      });
      setLoading(false);
    })();
  }, [telegramBotID, requestID]);

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
        <Offcanvas.Title>
          {t('title', { context: action === 'edit' ? 'edit' : 'add' })}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Suspense fallback={<Offcanvas.Loading />}>
        <OffcanvasContent />
      </Suspense>
    </Offcanvas>
  );
}

export default OffcanvasInner;
