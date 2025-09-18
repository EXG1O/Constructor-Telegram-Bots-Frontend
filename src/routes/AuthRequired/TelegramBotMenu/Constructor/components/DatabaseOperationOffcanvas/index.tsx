import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { createMessageToast } from 'components/ui/ToastContainer';

import {
  CreateBlockFormValues,
  defaultCreateBlockFormValues,
} from './components/CreateBlock';
import OffcanvasInner, { OffcanvasInnerProps } from './components/OffcanvasInner';
import {
  defaultTypeBlockFormValues,
  TypeBlockFormValues,
} from './components/TypeBlock';
import {
  defaultUpdateBlockFormValues,
  UpdateBlockFormValues,
} from './components/UpdateBlock';

import { defaultNameBlockFormValues, NameBlockFormValues } from '../NameBlock';

import {
  DatabaseOperationAPI,
  DatabaseOperationsAPI,
} from 'api/telegram-bots/database-operation';
import { Data, DatabaseOperation } from 'api/telegram-bots/database-operation/types';

import parseJsonField from '../../utils/parseJsonField';
import { useDatabaseOperationOffcanvasStore } from './store';
import { getCreateBlockOpen, getUpdateBlockOpen } from './utils';

export interface FormValues
  extends NameBlockFormValues,
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

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

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
      ? DatabaseOperationAPI.update(telegramBot.id, operationID, data)
      : DatabaseOperationsAPI.create(telegramBot.id, data));

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
