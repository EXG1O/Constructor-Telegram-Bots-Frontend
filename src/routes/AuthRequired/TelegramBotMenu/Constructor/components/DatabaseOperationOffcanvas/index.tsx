import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { defaultCreateBlockFormValues } from './components/CreateBlock/defaults';
import type { CreateBlockFormValues } from './components/CreateBlock/types';
import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';
import { defaultTypeBlockFormValues } from './components/TypeBlock/defaults';
import type { TypeBlockFormValues } from './components/TypeBlock/types';
import { defaultUpdateBlockFormValues } from './components/UpdateBlock/defaults';
import type { UpdateBlockFormValues } from './components/UpdateBlock/types';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import useFormikSubmit from '../../hooks/useFormikSubmit';

import {
  DatabaseOperationAPI,
  DatabaseOperationsAPI,
  DiagramDatabaseOperationAPI,
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

export interface DatabaseOperationOffcanvasProps extends OffcanvasInnerProps {}

function DatabaseOperationOffcanvas(
  props: DatabaseOperationOffcanvasProps,
): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'databaseOperationOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const operationID = useDatabaseOperationOffcanvasStore((state) => state.operationID);
  const action = useDatabaseOperationOffcanvasStore((state) => state.action);
  const hideOffcanvas = useDatabaseOperationOffcanvasStore(
    (state) => state.hideOffcanvas,
  );

  const handleSubmit = useFormikSubmit<DatabaseOperation, FormValues>(
    () => ({
      messages: {
        add: {
          success: t('messages.addDatabaseOperation.success'),
          error: t('messages.addDatabaseOperation.error'),
        },
        edit: {
          success: t('messages.editDatabaseOperation.success'),
          error: t('messages.editDatabaseOperation.error'),
        },
      },
      type: 'database_operation',
      action,
      saveAPICall: (
        { type, create_operation, update_operation, ...values },
        { setFieldError },
      ) => {
        let createOperationData: any[] | Record<string, any> | null = null;
        let updateOperationNewData: any[] | Record<string, any> | null = null;

        if (getCreateBlockOpen(type)) {
          createOperationData = parseJsonField(
            create_operation.data,
            'create_operation.data',
            setFieldError,
          );
          if (!createOperationData) return Promise.reject();
        }

        if (getUpdateBlockOpen(type)) {
          updateOperationNewData = parseJsonField(
            update_operation.new_data,
            'update_operation.new_data',
            setFieldError,
          );
          if (!updateOperationNewData) return Promise.reject();
        }

        const data:
          Data.DatabaseOperationsAPI.Create | Data.DatabaseOperationAPI.Update = {
          ...values,
          create_operation: createOperationData ? { data: createOperationData } : null,
          update_operation: updateOperationNewData
            ? { ...update_operation, new_data: updateOperationNewData }
            : null,
        };

        return action === 'edit' && operationID
          ? DatabaseOperationAPI.update(telegramBotID, operationID, data)
          : DatabaseOperationsAPI.create(telegramBotID, data);
      },
      diagramAPICall: (id) => DiagramDatabaseOperationAPI.get(telegramBotID, id),
      onHide: () => hideOffcanvas(),
    }),
    [operationID, action, hideOffcanvas, i18n.language],
  );

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
