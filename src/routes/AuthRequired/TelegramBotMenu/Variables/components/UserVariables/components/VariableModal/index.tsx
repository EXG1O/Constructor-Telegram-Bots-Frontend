import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, type FormikHelpers } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { createMessageToast } from 'components/ui/ToastContainer';

import ModalInner, { type ModalInnerProps } from './components/ModalInner';

import type { Variable } from 'api';
import { TelegramBotsService } from 'api';

import { useVariableModalStore } from './store';

export interface FormValues {
  name: string;
  value: string;
  description: string;
}

export interface VariableModalProps extends ModalInnerProps {
  onAdd?: (variable: Variable) => void;
  onSave?: (variable: Variable) => void;
}

export const defaultFormValues: FormValues = { name: '', value: '', description: '' };

function VariableModal({ onAdd, onSave, ...props }: VariableModalProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuVariables}`, any>(
    'telegram-bot-menu-variables',
    { keyPrefix: 'user.variableModal' },
  );

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const variableID = useVariableModalStore((state) => state.variableID);
  const action = useVariableModalStore((state) => state.action);
  const hideModal = useVariableModalStore((state) => state.hideModal);

  async function handleSubmit(
    values: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    const { data, error } = await (variableID
      ? TelegramBotsService.updateVariable({
          path: { telegramBotId: telegramBotID, id: variableID },
          body: values,
        })
      : TelegramBotsService.createVariable({
          path: { telegramBotId: telegramBotID },
          body: values,
        }));

    if (error || !data) {
      for (const item of error.errors) {
        if (!item.attr) continue;
        setFieldError(item.attr, item.detail);
      }
      createMessageToast({
        message: t(
          action === 'edit'
            ? 'messages.editVariable.error'
            : 'messages.addVariable.error',
        ),
        level: 'error',
      });
      return;
    }

    (variableID ? onSave : onAdd)?.(data);
    hideModal();
    createMessageToast({
      message: t(
        action === 'edit'
          ? 'messages.editVariable.success'
          : 'messages.addVariable.success',
      ),
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
      <ModalInner {...props} />
    </Formik>
  );
}

export default VariableModal;
