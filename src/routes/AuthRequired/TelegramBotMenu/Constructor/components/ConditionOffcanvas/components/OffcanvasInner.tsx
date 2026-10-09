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
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'conditionOffcanvas' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, setSubmitting, resetForm } =
    useFormikContext<FormValues>();

  const conditionID = useConditionOffcanvasStore((state) => state.id);
  const action = useConditionOffcanvasStore((state) => state.action);
  const show = useConditionOffcanvasStore((state) => state.show);
  const hideOffcanvas = useConditionOffcanvasStore((state) => state.hideOffcanvas);

  useEffect(() => {
    if (!conditionID) return;
    (async () => {
      setSubmitting(true);
      const { data, error } = await TelegramBotsService.getCondition({
        path: { telegramBotId: botID, id: conditionID },
      });

      if (error || !data) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getCondition.error'),
          level: 'error',
        });
        return;
      }

      const { id: _id, parts, ...rest } = data;
      setValues({
        ...rest,
        parts: parts.map(({ next_part_operator, ...part }) => ({
          ...part,
          next_part_operator: next_part_operator || 'null',
        })),
      });
      setSubmitting(false);
    })();
  }, [botID, conditionID]);

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
