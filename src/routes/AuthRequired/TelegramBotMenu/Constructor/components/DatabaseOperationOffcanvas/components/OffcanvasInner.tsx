import React, { type ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Offcanvas, { type OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { defaultCreateOperation } from './CreateBlock/defaults';
import OffcanvasContent from './OffcanvasContent';
import { defaultType } from './TypeBlock/defaults';
import { Type } from './TypeBlock/types';
import { defaultUpdateOperation } from './UpdateBlock/defaults';

import { DatabaseOperationAPI } from 'api/telegram-bots/database-operation';

import type { FormValues } from '..';
import { useDatabaseOperationOffcanvasStore } from '../store';

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
    keyPrefix: 'databaseOperationOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const operationID = useDatabaseOperationOffcanvasStore((state) => state.operationID);
  const show = useDatabaseOperationOffcanvasStore((state) => state.show);
  const loading = useDatabaseOperationOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useDatabaseOperationOffcanvasStore(
    (state) => state.hideOffcanvas,
  );
  const setLoading = useDatabaseOperationOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (!operationID) return;
    (async () => {
      const response = await DatabaseOperationAPI.get(telegramBotID, operationID);

      if (!response.ok) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getDatabaseOperation.error'),
          level: 'error',
        });
        return;
      }

      const { id, create_operation, update_operation, ...operation } = response.json;

      setValues({
        ...operation,
        type: create_operation
          ? Type.Create
          : update_operation
            ? Type.Update
            : defaultType,
        create_operation: create_operation
          ? { data: JSON.stringify(create_operation.data, undefined, 2) }
          : defaultCreateOperation,
        update_operation: update_operation
          ? {
              ...update_operation,
              new_data: JSON.stringify(update_operation.new_data, undefined, 2),
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
      <OffcanvasContent />
    </Offcanvas>
  );
}

export default OffcanvasInner;
