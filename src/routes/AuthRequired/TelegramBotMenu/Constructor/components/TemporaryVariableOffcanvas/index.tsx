import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { createMessageToast } from 'components/ui/ToastContainer';

import OffcanvasInner, { OffcanvasInnerProps } from './components/OffcanvasInner';
import {
  defaultValueBlockFormValues,
  ValueBlockFormValues,
} from './components/ValueBlock';

import { defaultNameBlockFormValues, NameBlockFormValues } from '../NameBlock';

import {
  TemporaryVariableAPI,
  TemporaryVariablesAPI,
} from 'api/telegram-bots/temporary-variable';
import { TemporaryVariable } from 'api/telegram-bots/temporary-variable/types';

import { useTemporaryVariableOffcanvasStore } from './store';

export interface FormValues extends NameBlockFormValues, ValueBlockFormValues {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultValueBlockFormValues,
};

export interface TemporaryVariableFormOffcanvasProps extends OffcanvasInnerProps {
  onAdd?: (variable: TemporaryVariable) => void;
  onSave?: (variable: TemporaryVariable) => void;
}

function TemporaryVariableOffcanvas({
  onAdd,
  onSave,
  ...props
}: TemporaryVariableFormOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'temporaryVariableOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const variableID = useTemporaryVariableOffcanvasStore((state) => state.variableID);
  const action = useTemporaryVariableOffcanvasStore((state) => state.action);
  const hideOffcanvas = useTemporaryVariableOffcanvasStore(
    (state) => state.hideOffcanvas,
  );

  async function handleSubmit(
    values: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    const response = await (variableID
      ? TemporaryVariableAPI.update(telegramBotID, variableID, values)
      : TemporaryVariablesAPI.create(telegramBotID, values));

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
      }
      createMessageToast({
        message: t(`messages.${action}TemporaryVariable.error`),
        level: 'error',
      });
      return;
    }

    (variableID ? onSave : onAdd)?.(response.json);
    hideOffcanvas();
    createMessageToast({
      message: t(`messages.${action}TemporaryVariable.success`),
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
      <OffcanvasInner {...props} />
    </Formik>
  );
}

export default memo(TemporaryVariableOffcanvas);
