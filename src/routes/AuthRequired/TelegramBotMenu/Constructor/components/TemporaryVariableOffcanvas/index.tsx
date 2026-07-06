import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';
import { defaultValueBlockFormValues } from './components/ValueBlock/defaults';
import type { ValueBlockFormValues } from './components/ValueBlock/types';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import useFormikSubmit from '../../hooks/useFormikSubmit';

import {
  DiagramTemporaryVariableAPI,
  TemporaryVariableAPI,
  TemporaryVariablesAPI,
} from 'api/telegram-bots/temporary-variable';
import type { TemporaryVariable } from 'api/telegram-bots/temporary-variable/types';

import { useTemporaryVariableOffcanvasStore } from './store';

export interface FormValues extends NameBlockFormValues, ValueBlockFormValues {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultValueBlockFormValues,
};

export interface TemporaryVariableFormOffcanvasProps extends OffcanvasInnerProps {}

function TemporaryVariableOffcanvas(
  props: TemporaryVariableFormOffcanvasProps,
): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'temporaryVariableOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const variableID = useTemporaryVariableOffcanvasStore((state) => state.variableID);
  const action = useTemporaryVariableOffcanvasStore((state) => state.action);
  const hideOffcanvas = useTemporaryVariableOffcanvasStore(
    (state) => state.hideOffcanvas,
  );

  const handleSubmit = useFormikSubmit<TemporaryVariable, FormValues>(
    () => ({
      messages: {
        add: {
          success: t('messages.addTemporaryVariable.success'),
          error: t('messages.addTemporaryVariable.error'),
        },
        edit: {
          success: t('messages.editTemporaryVariable.success'),
          error: t('messages.editTemporaryVariable.error'),
        },
      },
      type: 'temporary_variable',
      action,
      saveAPICall: (values) =>
        action === 'edit' && variableID
          ? TemporaryVariableAPI.update(telegramBotID, variableID, values)
          : TemporaryVariablesAPI.create(telegramBotID, values),
      diagramAPICall: (id) => DiagramTemporaryVariableAPI.get(telegramBotID, id),
      onHide: () => hideOffcanvas(),
    }),
    [variableID, action, hideOffcanvas, i18n.language],
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

export default memo(TemporaryVariableOffcanvas);
