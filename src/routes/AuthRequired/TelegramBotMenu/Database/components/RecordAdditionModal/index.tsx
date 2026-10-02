import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, type FormikHelpers } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Modal, { type ModalProps } from 'components/ui/Modal';
import { createMessageToast } from 'components/ui/ToastContainer';

import ModalContent from './components/ModalContent';

import useDatabaseRecordsStore from '../../hooks/useDatabaseRecordsStore';

import { TelegramBotsService } from 'api';

import safeParseJSON from 'utils/safeParseJSON';

interface FormValues {
  data: string;
}

export interface RecordAdditionModalProps
  extends
    Omit<ModalProps, 'show' | 'loading' | 'children' | 'onHide' | 'onHidden'>,
    Required<Pick<ModalProps, 'show' | 'onHide'>> {}

const defaultFormValues: FormValues = {
  data: JSON.stringify({ key: 'value' }, null, 2),
};

function RecordAdditionModal({
  onHide,
  ...props
}: RecordAdditionModalProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuDatabase}`, any>(
    'telegram-bot-menu-database',
    { keyPrefix: 'records.recordAdditionModal' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const updateRecords = useDatabaseRecordsStore((state) => state.updateRecords);

  async function handleSubmit(
    { data, ...values }: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    const { error } = await TelegramBotsService.createDatabaseRecord({
      path: { telegramBotId: botID },
      body: { ...values, data: safeParseJSON(data) },
    });

    if (error) {
      for (const item of error.errors) {
        if (!item.attr) continue;
        setFieldError(item.attr, item.detail);
      }
      createMessageToast({
        message: t('messages.addRecord.error'),
        level: 'error',
      });
      return;
    }

    updateRecords();
    onHide();
    createMessageToast({
      message: t('messages.addRecord.success'),
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
      {({ isSubmitting, resetForm }) => (
        <Modal {...props} loading={isSubmitting} onHide={onHide} onHidden={resetForm}>
          <ModalContent />
        </Modal>
      )}
    </Formik>
  );
}

export default RecordAdditionModal;
