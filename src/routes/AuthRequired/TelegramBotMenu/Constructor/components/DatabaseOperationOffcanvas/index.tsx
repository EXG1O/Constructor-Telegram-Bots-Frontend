import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import type { RouteID } from 'routes';
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

import useBlockFormikSubmit from '../../hooks/useBlockFormikSubmit';

import type { DatabaseOperation, DatabaseOperationRequestWritable } from 'api';
import { TelegramBotsService } from 'api';

import safeParseJSON from 'utils/safeParseJSON';

import { NodeType } from '../../enums';
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
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'databaseOperationOffcanvas' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const operationID = useDatabaseOperationOffcanvasStore((state) => state.id);
  const action = useDatabaseOperationOffcanvasStore((state) => state.action);
  const hideOffcanvas = useDatabaseOperationOffcanvasStore(
    (state) => state.hideOffcanvas,
  );

  const handleSubmit = useBlockFormikSubmit<DatabaseOperation, FormValues>(
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
      type: NodeType.DatabaseOperation,
      action,
      saveBlock: ({ type, create_operation, update_operation, ...values }) => {
        const data: DatabaseOperationRequestWritable = {
          ...values,
          create_operation: getCreateBlockOpen(type)
            ? { data: safeParseJSON(create_operation.data) }
            : null,
          update_operation: getUpdateBlockOpen(type)
            ? {
                ...update_operation,
                new_data: safeParseJSON(update_operation.new_data),
              }
            : null,
        };

        return action === 'edit' && operationID
          ? TelegramBotsService.updateDatabaseOperation({
              path: { telegramBotId: botID, id: operationID },
              body: data,
            })
          : TelegramBotsService.createDatabaseOperation({
              path: { telegramBotId: botID },
              body: data,
            });
      },
      getDiagramBlock: (id) =>
        TelegramBotsService.getDiagramDatabaseOperation({
          path: { telegramBotId: botID, id },
        }),
      onHide: () => hideOffcanvas(),
    }),
    [botID, operationID, action, hideOffcanvas, i18n.language],
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
