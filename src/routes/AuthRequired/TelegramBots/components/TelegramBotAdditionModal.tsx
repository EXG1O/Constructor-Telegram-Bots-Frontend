import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers } from 'formik';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import FormCheckFeedback from 'components/FormCheckFeedback';
import FormInputFeedback from 'components/FormInputFeedback';
import Modal, { ModalProps } from 'components/Modal';
import Stack from 'components/Stack';
import { createMessageToast } from 'components/ToastContainer';

import useTelegramBots from '../hooks/useTelegramBots';

import { TelegramBotsAPI } from 'api/telegram_bots/main';
import { Data } from 'api/telegram_bots/types';

type FormValues = Data.TelegramBotsAPI.Create;

export interface TelegramBotAdditionModalProps
  extends Omit<ModalProps, 'loading' | 'children' | 'onExited'> {
  show: NonNullable<ModalProps['show']>;
  onHide: NonNullable<ModalProps['onHide']>;
}

const defaultFormValues: FormValues = { api_token: '', is_private: false };

function TelegramBotAdditionModal({
  onHide,
  ...props
}: TelegramBotAdditionModalProps): ReactElement<TelegramBotAdditionModalProps> {
  const { t } = useTranslation(RouteID.TelegramBots, {
    keyPrefix: 'telegramBotAdditionModal',
  });

  const [telegramBots, setTelegramBots] = useTelegramBots();

  async function handleSubmit(
    values: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    const response = await TelegramBotsAPI.create(values);

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
      }
      createMessageToast({
        message: t('messages.createTelegramBot.error'),
        level: 'error',
      });
      return;
    }

    setTelegramBots([...telegramBots, response.json]);
    onHide();
    createMessageToast({
      message: t('messages.createTelegramBot.success'),
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
          onExited={() => resetForm()}
        >
          <Form>
            <Modal.Header closeButton>
              <Modal.Title>{t('title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body as={Stack} gap={2}>
              <FormInputFeedback
                name='api_token'
                placeholder={t('apiTokenInputPlaceholder')}
              />
              <FormCheckFeedback
                type='switch'
                name='is_private'
                label={t('privateSwitchLabel')}
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

export default memo(TelegramBotAdditionModal);
