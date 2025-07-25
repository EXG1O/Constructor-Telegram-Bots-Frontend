import React, { ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers } from 'formik';

import { RouteID } from 'routes';

import FormCheckFeedback from 'components/shared/FormCheckFeedback';
import FormInputFeedback from 'components/shared/FormInputFeedback';
import Button from 'components/ui/Button';
import Modal, { ModalProps } from 'components/ui/Modal';
import { createMessageToast } from 'components/ui/ToastContainer';

import useTelegramBots from '../hooks/useTelegramBots';

import { TelegramBotsAPI } from 'api/telegram-bots/telegram-bot';
import { Data } from 'api/telegram-bots/telegram-bot/types';

type FormValues = Data.TelegramBotsAPI.Create;

export interface TelegramBotAdditionModalProps
  extends Omit<ModalProps, 'loading' | 'children' | 'onHidden'> {
  show: NonNullable<ModalProps['show']>;
  onHide: NonNullable<ModalProps['onHide']>;
}

const defaultFormValues: FormValues = { api_token: '', is_private: false };

function TelegramBotAdditionModal({
  onHide,
  ...props
}: TelegramBotAdditionModalProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBots, {
    keyPrefix: 'telegramBotAdditionModal',
  });

  const formId = useId();

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
          onHidden={() => resetForm()}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t('title')}</Modal.Title>
          </Modal.Header>
          <Modal.Body asChild>
            <Form id={formId} className='flex flex-col gap-2'>
              <FormInputFeedback
                name='api_token'
                placeholder={t('apiTokenInputPlaceholder')}
              />
              <FormCheckFeedback
                type='switch'
                name='is_private'
                label={t('privateSwitchLabel')}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' form={formId} variant='success' className='w-full'>
              {t('addButton')}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Formik>
  );
}

export default TelegramBotAdditionModal;
