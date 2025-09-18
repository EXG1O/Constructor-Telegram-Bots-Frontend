import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { createMessageToast } from 'components/ui/ToastContainer';

import OffcanvasInner, { OffcanvasInnerProps } from './components/OffcanvasInner';
import {
  defaultPartsBlockFormValues,
  PartsBlockFormValues,
} from './components/PartsBlock';

import { defaultNameBlockFormValues, NameBlockFormValues } from '../NameBlock';

import { ConditionAPI, ConditionsAPI } from 'api/telegram-bots/condition';
import { Condition, Data } from 'api/telegram-bots/condition/types';

import { useConditionOffcanvasStore } from './store';

export interface FormValues extends NameBlockFormValues, PartsBlockFormValues {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultPartsBlockFormValues,
};

export interface ConditionFormOffcanvasProps extends OffcanvasInnerProps {
  onAdd?: (condition: Condition) => void;
  onSave?: (condition: Condition) => void;
}

function ConditionOffcanvas({
  onAdd,
  onSave,
  ...props
}: ConditionFormOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'conditionOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const conditionID = useConditionOffcanvasStore((state) => state.conditionID);
  const action = useConditionOffcanvasStore((state) => state.action);
  const hideOffcanvas = useConditionOffcanvasStore((state) => state.hideOffcanvas);

  async function handleSubmit(
    { parts, ...values }: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    const data: Data.ConditionsAPI.Create | Data.ConditionAPI.Update = {
      ...values,
      parts: parts.map(({ next_part_operator, ...part }) => ({
        ...part,
        next_part_operator: next_part_operator !== 'null' ? next_part_operator : null,
      })),
    };

    const response = await (conditionID
      ? ConditionAPI.update(telegramBot.id, conditionID, data)
      : ConditionsAPI.create(telegramBot.id, data));

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
      }
      createMessageToast({
        message: t(`messages.${action}Condition.error`),
        level: 'error',
      });
      return;
    }

    (conditionID ? onSave : onAdd)?.(response.json);
    hideOffcanvas();
    createMessageToast({
      message: t(`messages.${action}Condition.success`),
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

export default memo(ConditionOffcanvas);
