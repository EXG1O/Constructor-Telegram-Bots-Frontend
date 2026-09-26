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

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const operationID = useDatabaseOperationOffcanvasStore((state) => state.operationID);
  const action = useDatabaseOperationOffcanvasStore((state) => state.action);
  const show = useDatabaseOperationOffcanvasStore((state) => state.show);
  const loading = useDatabaseOperationOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useDatabaseOperationOffcanvasStore(
    (state) => state.hideOffcanvas,
  );
  const setLoading = useDatabaseOperationOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (!operationID) return;
    (async () => {
      const { data, error } = await TelegramBotsService.getDatabaseOperation({
        path: { telegramBotId: telegramBotID, id: operationID },
      });

      if (error || !data) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getDatabaseOperation.error'),
          level: 'error',
        });
        return;
      }

      const { id: _id, create_operation, update_operation, ...operation } = data;

      setValues({
        ...operation,
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
      setLoading(false);
    })();
  }, [telegramBotID, operationID]);

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
