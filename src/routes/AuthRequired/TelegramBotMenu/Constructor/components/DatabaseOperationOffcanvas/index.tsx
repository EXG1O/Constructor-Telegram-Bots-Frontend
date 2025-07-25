import React, { ReactElement, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Button from 'components/ui/Button';
import Offcanvas, { OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import CreateBlock, {
  CreateBlockFormValues,
  defaultCreateBlockFormValues,
  defaultCreateOperation,
} from './components/CreateBlock';
import TypeBlock, {
  defaultType,
  defaultTypeBlockFormValues,
  Type,
  TypeBlockFormValues,
} from './components/TypeBlock';
import UpdateBlock, {
  defaultUpdateBlockFormValues,
  defaultUpdateOperation,
  UpdateBlockFormValues,
} from './components/UpdateBlock';

import FormToggleSection from '../FormToggleSection';
import NameBlock, {
  defaultNameBlockFormValues,
  NameBlockFormValues,
} from '../NameBlock';

import {
  DatabaseOperationAPI,
  DatabaseOperationsAPI,
} from 'api/telegram_bots/database_operation';
import { Data, DatabaseOperation } from 'api/telegram_bots/database_operation/types';

import parseJsonField from '../../utils/parseJsonField';
import { useDatabaseOperationOffcanvasStore } from './store';
import { getCreateBlockOpen, getUpdateBlockOpen } from './utils';

export interface FormValues
  extends NameBlockFormValues,
    TypeBlockFormValues,
    CreateBlockFormValues,
    UpdateBlockFormValues {}

interface InnerDatabaseOperationOffcanvasProps
  extends Omit<OffcanvasProps, 'show' | 'loading' | 'children' | 'onHide'> {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultTypeBlockFormValues,
  ...defaultCreateBlockFormValues,
  ...defaultUpdateBlockFormValues,
};

function InnerDatabaseOperationOffcanvas({
  onHidden,
  ...props
}: InnerDatabaseOperationOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'databaseOperationOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const operationID = useDatabaseOperationOffcanvasStore((state) => state.operationID);
  const action = useDatabaseOperationOffcanvasStore((state) => state.action);
  const show = useDatabaseOperationOffcanvasStore((state) => state.show);
  const loading = useDatabaseOperationOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useDatabaseOperationOffcanvasStore(
    (state) => state.hideOffcanvas,
  );
  const setLoading = useDatabaseOperationOffcanvasStore((state) => state.setLoading);

  const formID = useId();

  useEffect(() => {
    if (!operationID) return;
    (async () => {
      const response = await DatabaseOperationAPI.get(telegramBot.id, operationID);

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
  }, [operationID]);

  function handleHidden(): void {
    resetForm();
    onHidden?.();
  }

  return (
    <Offcanvas
      {...props}
      show={show}
      loading={isSubmitting || loading}
      onHide={hideOffcanvas}
      onHidden={handleHidden}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{t('title', { context: action })}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body asChild>
        <Form id={formID}>
          <NameBlock className='mb-3' />
          <TypeBlock className='mb-3' />
          <FormToggleSection name='type' getOpen={getCreateBlockOpen}>
            <CreateBlock />
          </FormToggleSection>
          <FormToggleSection name='type' getOpen={getUpdateBlockOpen}>
            <UpdateBlock />
          </FormToggleSection>
        </Form>
      </Offcanvas.Body>
      <Offcanvas.Footer>
        <Button form={formID} type='submit' variant='success' className='w-full'>
          {t('actionButton', { context: action })}
        </Button>
      </Offcanvas.Footer>
    </Offcanvas>
  );
}

export interface DatabaseOperationOffcanvasProps
  extends InnerDatabaseOperationOffcanvasProps {
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
      <InnerDatabaseOperationOffcanvas {...props} />
    </Formik>
  );
}

export default DatabaseOperationOffcanvas;
