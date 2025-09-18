import React, { ReactElement, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { FormValues } from '..';

import Modal, { ModalProps } from 'components/ui/Modal';
import { createMessageToast } from 'components/ui/ToastContainer';

import ModalContent from './ModalContent';

import { VariableAPI } from 'api/telegram-bots/variable';

import { useVariableModalStore } from '../store';

export interface ModalInnerProps extends Omit<ModalProps, 'show' | 'loading'> {}

function ModalInner({ onHide, onHidden, ...props }: ModalInnerProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'user.variableModal',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const variableID = useVariableModalStore((state) => state.variableID);
  const show = useVariableModalStore((state) => state.show);
  const loading = useVariableModalStore((state) => state.loading);
  const hideModal = useVariableModalStore((state) => state.hideModal);
  const setLoading = useVariableModalStore((state) => state.setLoading);

  useEffect(() => {
    if (variableID) {
      (async () => {
        const response = await VariableAPI.get(telegramBot.id, variableID);

        if (!response.ok) {
          hideModal();
          createMessageToast({
            message: t('messages.getVariable.error'),
            level: 'error',
          });
          return;
        }

        const { id, ...variable } = response.json;

        setValues(variable);
        setLoading(false);
      })();
    }
  }, [variableID]);

  const handleHide = useCallback(() => {
    hideModal();
    onHide?.();
  }, [hideModal, onHide]);

  const handleHidden = useCallback(() => {
    resetForm();
    onHidden?.();
  }, [resetForm, onHidden]);

  return (
    <Modal
      {...props}
      show={show}
      loading={isSubmitting || loading}
      onHide={handleHide}
      onHidden={handleHidden}
    >
      <ModalContent />
    </Modal>
  );
}
export default ModalInner;
