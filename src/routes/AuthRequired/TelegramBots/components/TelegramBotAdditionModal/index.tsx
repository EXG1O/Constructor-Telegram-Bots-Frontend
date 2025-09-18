import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers } from 'formik';

import { RouteID } from 'routes';

import Modal, { ModalProps } from 'components/ui/Modal';
import { createMessageToast } from 'components/ui/ToastContainer';

import ModalContent from './components/ModalContent';

import useTelegramBots from '../../hooks/useTelegramBots';

import { TelegramBotsAPI } from 'api/telegram-bots/telegram-bot';
import { Data } from 'api/telegram-bots/telegram-bot/types';

type FormValues = Data.TelegramBotsAPI.Create;

export interface TelegramBotAdditionModalProps
  extends Omit<ModalProps, 'show' | 'loading' | 'children' | 'onHide' | 'onHidden'>,
    Required<Pick<ModalProps, 'show' | 'onHide'>> {}

const defaultFormValues: FormValues = { api_token: '', is_private: false };

function TelegramBotAdditionModal({
  onHide,
  ...props
}: TelegramBotAdditionModalProps): ReactElement {
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
        <Modal {...props} loading={isSubmitting} onHide={onHide} onHidden={resetForm}>
          <ModalContent />
        </Modal>
      )}
    </Formik>
  );
}

export default TelegramBotAdditionModal;
