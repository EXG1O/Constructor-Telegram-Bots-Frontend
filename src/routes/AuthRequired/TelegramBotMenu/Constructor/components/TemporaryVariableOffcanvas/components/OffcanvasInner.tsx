import React, { lazy, type ReactElement, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Offcanvas, { type OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { TemporaryVariableAPI } from 'api/telegram-bots/temporary-variable';

import type { FormValues } from '..';
import { useTemporaryVariableOffcanvasStore } from '../store';

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
    keyPrefix: 'temporaryVariableOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const variableID = useTemporaryVariableOffcanvasStore((state) => state.variableID);
  const show = useTemporaryVariableOffcanvasStore((state) => state.show);
  const loading = useTemporaryVariableOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useTemporaryVariableOffcanvasStore(
    (state) => state.hideOffcanvas,
  );
  const setLoading = useTemporaryVariableOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (!variableID) return;
    (async () => {
      const response = await TemporaryVariableAPI.get(telegramBotID, variableID);

      if (!response.ok) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getTemporaryVariable.error'),
          level: 'error',
        });
        return;
      }

      const { id, ...variable } = response.json;

      setValues(variable);
      setLoading(false);
    })();
  }, [telegramBotID, variableID]);

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
