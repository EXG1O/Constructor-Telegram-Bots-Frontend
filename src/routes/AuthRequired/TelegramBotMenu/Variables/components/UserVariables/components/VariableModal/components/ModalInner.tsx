import React, { type ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Modal, { type ModalProps } from 'components/ui/Modal';
import { createMessageToast } from 'components/ui/ToastContainer';

import ModalContent from './ModalContent';

import { TelegramBotsService } from 'api';

import composeHandlers from 'utils/composeHandlers';

import type { FormValues } from '..';
import { useVariableModalStore } from '../store';

export interface ModalInnerProps extends Omit<ModalProps, 'show' | 'loading'> {}

function ModalInner({ onHide, onHidden, ...props }: ModalInnerProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuVariables}`, any>(
    'telegram-bot-menu-variables',
    { keyPrefix: 'user.variableModal' },
  );

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const variableID = useVariableModalStore((state) => state.variableID);
  const show = useVariableModalStore((state) => state.show);
  const loading = useVariableModalStore((state) => state.loading);
  const hideModal = useVariableModalStore((state) => state.hideModal);
  const setLoading = useVariableModalStore((state) => state.setLoading);

  useEffect(() => {
    if (variableID) {
      (async () => {
        const { data, error } = await TelegramBotsService.getVariable({
          path: { telegramBotId: telegramBotID, id: variableID },
        });

        if (error || !data) {
          hideModal();
          createMessageToast({
            message: t('messages.getVariable.error'),
            level: 'error',
          });
          return;
        }

        const { id: _id, ...variable } = data;

        setValues(variable);
        setLoading(false);
      })();
    }
  }, [telegramBotID, variableID]);

  return (
    <Modal
      {...props}
      show={show}
      loading={isSubmitting || loading}
      onHide={composeHandlers(hideModal, onHide)}
      onHidden={composeHandlers(resetForm, onHidden)}
    >
      <ModalContent />
    </Modal>
  );
}

export default ModalInner;
