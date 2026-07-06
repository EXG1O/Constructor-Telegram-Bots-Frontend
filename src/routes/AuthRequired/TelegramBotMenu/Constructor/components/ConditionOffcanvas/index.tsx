import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';
import { defaultPartsBlockFormValues } from './components/PartsBlock/defaults';
import type { PartsBlockFormValues } from './components/PartsBlock/types';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import useFormikSubmit from '../../hooks/useFormikSubmit';

import {
  ConditionAPI,
  ConditionsAPI,
  DiagramConditionAPI,
} from 'api/telegram-bots/condition';
import type { Condition, Data } from 'api/telegram-bots/condition/types';

import { useConditionOffcanvasStore } from './store';

export interface FormValues extends NameBlockFormValues, PartsBlockFormValues {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultPartsBlockFormValues,
};

export interface ConditionFormOffcanvasProps extends OffcanvasInnerProps {}

function ConditionOffcanvas(props: ConditionFormOffcanvasProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'conditionOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const conditionID = useConditionOffcanvasStore((state) => state.conditionID);
  const action = useConditionOffcanvasStore((state) => state.action);
  const hideOffcanvas = useConditionOffcanvasStore((state) => state.hideOffcanvas);

  const handleSubmit = useFormikSubmit<Condition, FormValues>(
    () => ({
      messages: {
        add: {
          success: t('messages.addCondition.success'),
          error: t('messages.addCondition.error'),
        },
        edit: {
          success: t('messages.editCondition.success'),
          error: t('messages.editCondition.error'),
        },
      },
      type: 'condition',
      action,
      saveAPICall: ({ parts, ...values }) => {
        const data: Data.ConditionsAPI.Create | Data.ConditionAPI.Update = {
          ...values,
          parts: parts.map(({ next_part_operator, ...part }) => ({
            ...part,
            next_part_operator:
              next_part_operator !== 'null' ? next_part_operator : null,
          })),
        };

        return action === 'edit' && conditionID
          ? ConditionAPI.update(telegramBotID, conditionID, data)
          : ConditionsAPI.create(telegramBotID, data);
      },
      diagramAPICall: (id) => DiagramConditionAPI.get(telegramBotID, id),
      onHide: () => hideOffcanvas(),
    }),
    [conditionID, action, hideOffcanvas, i18n.language],
  );

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
