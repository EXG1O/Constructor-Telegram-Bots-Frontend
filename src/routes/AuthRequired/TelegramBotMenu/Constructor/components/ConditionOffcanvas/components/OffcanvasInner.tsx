import React, { lazy, type ReactElement, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Offcanvas, { type OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { ConditionAPI } from 'api/telegram-bots/condition';

import type { FormValues } from '..';
import { useConditionOffcanvasStore } from '../store';

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
    keyPrefix: 'conditionOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const conditionID = useConditionOffcanvasStore((state) => state.conditionID);
  const show = useConditionOffcanvasStore((state) => state.show);
  const loading = useConditionOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useConditionOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useConditionOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (!conditionID) return;
    (async () => {
      const response = await ConditionAPI.get(telegramBotID, conditionID);

      if (!response.ok) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getCondition.error'),
          level: 'error',
        });
        return;
      }

      const { id, parts, ...condition } = response.json;

      setValues({
        ...condition,
        parts: parts.map(({ next_part_operator, ...part }) => ({
          ...part,
          next_part_operator: next_part_operator ?? 'null',
        })),
      });
      setLoading(false);
    })();
  }, [telegramBotID, conditionID]);

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
