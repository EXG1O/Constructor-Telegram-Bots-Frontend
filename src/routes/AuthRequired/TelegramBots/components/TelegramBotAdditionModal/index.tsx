import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, type FormikHelpers } from 'formik';

import type { RouteID } from 'routes';

import Modal, { type ModalProps } from 'components/ui/Modal';
import { createMessageToast } from 'components/ui/ToastContainer';

import ModalContent from './components/ModalContent';

import useTelegramBots from '../../hooks/useTelegramBots';

import type { TelegramBotRequest } from 'api';
import { TelegramBotsService } from 'api';

type FormValues = TelegramBotRequest;

export interface TelegramBotAdditionModalProps
  extends
    Omit<ModalProps, 'show' | 'loading' | 'children' | 'onHide' | 'onHidden'>,
    Required<Pick<ModalProps, 'show' | 'onHide'>> {}

const defaultFormValues: FormValues = { api_token: '', is_private: false };

function TelegramBotAdditionModal({
  onHide,
  ...props
}: TelegramBotAdditionModalProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBots}`, any>('telegram-bots', {
    keyPrefix: 'telegramBotAdditionModal',
  });

  const [telegramBots, setTelegramBots] = useTelegramBots();

  async function handleSubmit(
    values: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    const { data, error } = await TelegramBotsService.createTelegramBot({
      body: values,
    });

    if (error || !data) {
      for (const item of error.errors) {
        if (!item.attr) continue;
        setFieldError(item.attr, item.detail);
      }
      createMessageToast({
        message: t('messages.createTelegramBot.error'),
        level: 'error',
      });
      return;
    }

    setTelegramBots([...telegramBots, data]);
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
