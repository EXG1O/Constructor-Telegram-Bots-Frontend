import React, { ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import FormCodeInputFeedback from 'components/shared/FormCodeInputFeedback';
import Button from 'components/ui/Button';
import Modal, { ModalProps } from 'components/ui/Modal';
import { createMessageToast } from 'components/ui/ToastContainer';

import useDatabaseRecordsStore from '../hooks/useDatabaseRecordsStore';

import { DatabaseRecordsAPI } from 'api/telegram-bots/database-record';

interface FormValues {
  data: string;
}

export interface RecordAdditionModalProps
  extends Omit<ModalProps, 'show' | 'loading' | 'children' | 'onHide' | 'onHidden'>,
    Required<Pick<ModalProps, 'show' | 'onHide'>> {}

const defaultFormValues: FormValues = {
  data: JSON.stringify({ key: 'value' }, undefined, 4),
};

function RecordAdditionModal({
  onHide,
  ...props
}: RecordAdditionModalProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuDatabase, {
    keyPrefix: 'records.recordAdditionModal',
  });

  const formId = useId();

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const updateRecords = useDatabaseRecordsStore((state) => state.updateRecords);

  async function handleSubmit(
    values: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    let data: Record<string, any>;

    try {
      data = JSON.parse(values.data);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setFieldError('data', t('messages.addRecord.error', { context: 'validJSON' }));
      }

      createMessageToast({
        message: t('messages.addRecord.error'),
        level: 'error',
      });
      return;
    }

    const response = await DatabaseRecordsAPI.create(telegramBot.id, { data });

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
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
        <Modal
          {...props}
          loading={isSubmitting}
          onHide={onHide}
          onHidden={() => resetForm()}
        >
          <Modal.Content>
            <Modal.Header closeButton>
              <Modal.Title>{t('title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body asChild>
              <Form id={formId}>
                <FormCodeInputFeedback language='json' name='data' />
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button form={formId} type='submit' variant='success' className='w-full'>
                {t('addButton')}
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      )}
    </Formik>
  );
}

export default RecordAdditionModal;
