import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, type FormikHelpers } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { createMessageToast } from 'components/ui/ToastContainer';

import { defaultCreateBlockFormValues } from './components/CreateBlock/defaults';
import type { CreateBlockFormValues } from './components/CreateBlock/types';
import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';
import { defaultTypeBlockFormValues } from './components/TypeBlock/defaults';
import type { TypeBlockFormValues } from './components/TypeBlock/types';
import { defaultUpdateBlockFormValues } from './components/UpdateBlock/defaults';
import type { UpdateBlockFormValues } from './components/UpdateBlock/types';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import {
  DatabaseOperationAPI,
  DatabaseOperationsAPI,
} from 'api/telegram-bots/database-operation';
import type {
  Data,
  DatabaseOperation,
} from 'api/telegram-bots/database-operation/types';

import parseJsonField from '../../utils/parseJsonField';
import { useDatabaseOperationOffcanvasStore } from './store';
import { getCreateBlockOpen, getUpdateBlockOpen } from './utils';

export interface FormValues
  extends
    NameBlockFormValues,
    TypeBlockFormValues,
    CreateBlockFormValues,
    UpdateBlockFormValues {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultTypeBlockFormValues,
  ...defaultCreateBlockFormValues,
  ...defaultUpdateBlockFormValues,
};

export interface DatabaseOperationOffcanvasProps extends OffcanvasInnerProps {
  onAdd?: (operation: DatabaseOperation) => void;
  onSave?: (operation: DatabaseOperation) => void;
}

function DatabaseOperationOffcanvas({
  onAdd,
  onSave,
  ...props
}: DatabaseOperationOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'databaseOperationOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const operationID = useDatabaseOperationOffcanvasStore((state) => state.operationID);
  const action = useDatabaseOperationOffcanvasStore((state) => state.action);
  const hideOffcanvas = useDatabaseOperationOffcanvasStore(
    (state) => state.hideOffcanvas,
  );

  async function handleSubmit(
    { type, create_operation, update_operation, ...values }: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    let createOperationData: any[] | Record<string, any> | null = null;
    let updateOperationNewData: any[] | Record<string, any> | null = null;

    if (getCreateBlockOpen(type)) {
      createOperationData = parseJsonField(
        create_operation.data,
        'create_operation.data',
        setFieldError,
      );
      if (!createOperationData) return;
    }

    if (getUpdateBlockOpen(type)) {
      updateOperationNewData = parseJsonField(
        update_operation.new_data,
        'update_operation.new_data',
        setFieldError,
      );
      if (!updateOperationNewData) return;
    }

    const data: Data.DatabaseOperationsAPI.Create | Data.DatabaseOperationAPI.Update = {
      ...values,
      create_operation: createOperationData ? { data: createOperationData } : null,
      update_operation: updateOperationNewData
        ? { ...update_operation, new_data: updateOperationNewData }
        : null,
    };

    const response = await (operationID
      ? DatabaseOperationAPI.update(telegramBotID, operationID, data)
      : DatabaseOperationsAPI.create(telegramBotID, data));

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
      }
      createMessageToast({
        message: t(`messages.${action}DatabaseOperation.error`),
        level: 'error',
      });
      return;
    }

    (operationID ? onSave : onAdd)?.(response.json);
    hideOffcanvas();
    createMessageToast({
      message: t(`messages.${action}DatabaseOperation.success`),
      level: 'success',
    });
  }

  return (
    <Formik
      initialValues={defaultFormValues}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      <OffcanvasInner {...props} />
    </Formik>
  );
}

export default memo(DatabaseOperationOffcanvas);
