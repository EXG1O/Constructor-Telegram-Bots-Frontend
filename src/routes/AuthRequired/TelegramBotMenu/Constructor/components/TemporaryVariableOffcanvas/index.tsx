import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';
import { defaultValueBlockFormValues } from './components/ValueBlock/defaults';
import type { ValueBlockFormValues } from './components/ValueBlock/types';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import useBlockFormikSubmit from '../../hooks/useBlockFormikSubmit';

import type { TemporaryVariable } from 'api';
import { TelegramBotsService } from 'api';

import { NodeType } from '../../enums';
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
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'temporaryVariableOffcanvas' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const variableID = useTemporaryVariableOffcanvasStore((state) => state.id);
  const action = useTemporaryVariableOffcanvasStore((state) => state.action);
  const hideOffcanvas = useTemporaryVariableOffcanvasStore(
    (state) => state.hideOffcanvas,
  );

  const handleSubmit = useBlockFormikSubmit<TemporaryVariable, FormValues>(
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
      type: NodeType.TemporaryVariable,
      action,
      saveBlock: (values) =>
        action === 'edit' && variableID
          ? TelegramBotsService.updateTemporaryVariable({
              path: { telegramBotId: botID, id: variableID },
              body: values,
            })
          : TelegramBotsService.createTemporaryVariable({
              path: { telegramBotId: botID },
              body: values,
            }),
      getDiagramBlock: (id) =>
        TelegramBotsService.getDiagramTemporaryVariable({
          path: { telegramBotId: botID, id },
        }),
      onHide: () => hideOffcanvas(),
    }),
    [botID, variableID, action, hideOffcanvas, i18n.language],
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
