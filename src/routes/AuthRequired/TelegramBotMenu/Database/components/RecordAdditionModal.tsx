import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers } from 'formik';
import monaco from 'monaco-editor';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Button from 'components/ui/Button';
import FormCodeInputFeedback from 'components/shared/FormCodeInputFeedback';
import Modal, { ModalProps } from 'components/ui/Modal';
import { createMessageToast } from 'components/ui/ToastContainer';

import useDatabaseRecordsStore from '../hooks/useDatabaseRecordsStore';

import { DatabaseRecordsAPI } from 'api/telegram_bots/main';

interface FormValues {
  data: string;
}

export interface RecordAdditionModalProps
  extends Omit<ModalProps, 'loading' | 'children' | 'onHidden'> {
  show: NonNullable<ModalProps['show']>;
  onHide: NonNullable<ModalProps['onHide']>;
}

const defaultFormValues: FormValues = {
  data: JSON.stringify({ key: 'value' }, undefined, 4),
};

const monacoOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  glyphMargin: false,
  folding: false,
  lineNumbers: 'off',
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
};

function RecordAdditionModal({
  onHide,
  ...props
}: RecordAdditionModalProps): ReactElement<RecordAdditionModalProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuDatabase, {
    keyPrefix: 'records.recordAdditionModal',
  });

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
          <Form>
            <Modal.Header closeButton>
              <Modal.Title>{t('title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormCodeInputFeedback
                language='json'
                name='data'
                options={monacoOptions}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant='success' type='submit'>
                {t('addButton')}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </Formik>
  );
}

export default RecordAdditionModal;
