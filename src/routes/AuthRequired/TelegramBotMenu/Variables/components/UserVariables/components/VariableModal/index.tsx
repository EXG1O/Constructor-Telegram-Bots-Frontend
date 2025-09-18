import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { createMessageToast } from 'components/ui/ToastContainer';

import ModalInner, { ModalInnerProps } from './components/ModalInner';

import { VariableAPI, VariablesAPI } from 'api/telegram-bots/variable';
import { Variable } from 'api/telegram-bots/variable/types';

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
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'user.variableModal',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const variableID = useVariableModalStore((state) => state.variableID);
  const action = useVariableModalStore((state) => state.action);
  const hideModal = useVariableModalStore((state) => state.hideModal);

  async function handleSubmit(
    values: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    const response = await (variableID
      ? VariableAPI.update(telegramBot.id, variableID, values)
      : VariablesAPI.create(telegramBot.id, values));

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
      }
      createMessageToast({
        message: t(`messages.${action}Variable.error`),
        level: 'error',
      });
      return;
    }

    (variableID ? onSave : onAdd)?.(response.json);
    hideModal();
    createMessageToast({
      message: t(`messages.${action}Variable.success`),
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
