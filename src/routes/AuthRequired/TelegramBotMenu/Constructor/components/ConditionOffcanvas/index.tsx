import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';
import { defaultPartsBlockFormValues } from './components/PartsBlock/defaults';
import type { PartsBlockFormValues } from './components/PartsBlock/types';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import useBlockFormikSubmit from '../../hooks/useBlockFormikSubmit';

import type {
  Condition,
  ConditionPartNextPartOperator,
  ConditionPartType,
  ConditionRequestWritable,
} from 'api';
import { type ConditionPartOperatorType, TelegramBotsService } from 'api';

import { NodeType } from '../../enums';
import { useConditionOffcanvasStore } from './store';

export interface FormValues extends NameBlockFormValues, PartsBlockFormValues {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultPartsBlockFormValues,
};

export interface ConditionFormOffcanvasProps extends OffcanvasInnerProps {}

function ConditionOffcanvas(props: ConditionFormOffcanvasProps): ReactElement {
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'conditionOffcanvas' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const conditionID = useConditionOffcanvasStore((state) => state.id);
  const action = useConditionOffcanvasStore((state) => state.action);
  const hideOffcanvas = useConditionOffcanvasStore((state) => state.hideOffcanvas);

  const handleSubmit = useBlockFormikSubmit<Condition, FormValues>(
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
      type: NodeType.Condition,
      action,
      saveBlock: ({ parts, ...values }) => {
        const data: ConditionRequestWritable = {
          ...values,
          parts: parts.map(({ type, operator, next_part_operator, ...part }) => ({
            ...part,
            type: type as ConditionPartType,
            operator: operator as ConditionPartOperatorType,
            next_part_operator:
              next_part_operator !== 'null'
                ? (next_part_operator as ConditionPartNextPartOperator)
                : null,
          })),
        };

        return action === 'edit' && conditionID
          ? TelegramBotsService.updateCondition({
              path: { telegramBotId: botID, id: conditionID },
              body: data,
            })
          : TelegramBotsService.createCondition({
              path: { telegramBotId: botID },
              body: data,
            });
      },
      getDiagramBlock: (id) =>
        TelegramBotsService.getDiagramCondition({
          path: { telegramBotId: botID, id },
        }),
      onHide: () => hideOffcanvas(),
    }),
    [botID, conditionID, action, hideOffcanvas, i18n.language],
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
