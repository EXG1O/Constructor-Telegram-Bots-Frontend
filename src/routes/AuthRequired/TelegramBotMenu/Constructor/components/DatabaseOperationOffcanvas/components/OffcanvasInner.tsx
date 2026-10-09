import React, { lazy, type ReactElement, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Offcanvas, { type OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { defaultCreateOperation } from './CreateBlock/defaults';
import { defaultType } from './TypeBlock/defaults';
import { Type } from './TypeBlock/types';
import { defaultUpdateOperation } from './UpdateBlock/defaults';

import { TelegramBotsService } from 'api';

import composeHandlers from 'utils/composeHandlers';

import type { FormValues } from '..';
import { useDatabaseOperationOffcanvasStore } from '../store';

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
    { keyPrefix: 'databaseOperationOffcanvas' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, setSubmitting, resetForm } =
    useFormikContext<FormValues>();

  const operationID = useDatabaseOperationOffcanvasStore((state) => state.id);
  const action = useDatabaseOperationOffcanvasStore((state) => state.action);
  const show = useDatabaseOperationOffcanvasStore((state) => state.show);
  const hideOffcanvas = useDatabaseOperationOffcanvasStore(
    (state) => state.hideOffcanvas,
  );

  useEffect(() => {
    if (!operationID) return;
    (async () => {
      setSubmitting(true);
      const { data, error } = await TelegramBotsService.getDatabaseOperation({
        path: { telegramBotId: botID, id: operationID },
      });

      if (error || !data) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getDatabaseOperation.error'),
          level: 'error',
        });
        return;
      }

      const { id: _id, create_operation, update_operation, ...rest } = data;
      setValues({
        ...rest,
        type: create_operation
          ? Type.Create
          : update_operation
            ? Type.Update
            : defaultType,
        create_operation: create_operation
          ? { data: JSON.stringify(create_operation.data, null, 2) }
          : defaultCreateOperation,
        update_operation: update_operation
          ? {
              ...update_operation,
              overwrite: update_operation.overwrite ?? defaultUpdateOperation.overwrite,
              create_if_not_found:
                update_operation.create_if_not_found ??
                defaultUpdateOperation.create_if_not_found,
              new_data: JSON.stringify(update_operation.new_data, null, 2),
            }
          : defaultUpdateOperation,
      });
      setSubmitting(false);
    })();
  }, [botID, operationID]);

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
