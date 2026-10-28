import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { defaultMessageDeletionBlockFormValues } from './components/MessageDeletionBlock/defaults';
import type { MessageDeletionBlockFormValues } from './components/MessageDeletionBlock/types';
import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';
import { defaultTypeBlockFormValues } from './components/TypeBlock/defaults';
import { Type } from './components/TypeBlock/enums';
import type { TypeBlockFormValues } from './components/TypeBlock/types';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import useBlockFormikSubmit from '../../hooks/useBlockFormikSubmit';

import type { Action, ActionRequestWritable } from 'api';
import { TelegramBotsService } from 'api';

import { NodeType } from '../../enums';
import { useActionOffcanvasStore } from './store';

export interface FormValues
  extends NameBlockFormValues, TypeBlockFormValues, MessageDeletionBlockFormValues {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultTypeBlockFormValues,
  ...defaultMessageDeletionBlockFormValues,
};

export interface ActionOffcanvasProps extends OffcanvasInnerProps {}

function ActionOffcanvas(props: ActionOffcanvasProps): ReactElement {
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'actionOffcanvas' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const actionID = useActionOffcanvasStore((state) => state.id);
  const action = useActionOffcanvasStore((state) => state.action);
  const hideOffcanvas = useActionOffcanvasStore((state) => state.hideOffcanvas);

  const handleSubmit = useBlockFormikSubmit<Action, FormValues>(
    () => ({
      messages: {
        add: {
          success: t('messages.addAction.success'),
          error: t('messages.addAction.error'),
        },
        edit: {
          success: t('messages.editAction.success'),
          error: t('messages.editAction.error'),
        },
      },
      type: NodeType.Action,
      action,
      saveBlock: ({ name, type, message_deletion, x, y }) => {
        const data: ActionRequestWritable = {
          name,
          message_deletion: type === Type.MessageDeletion ? message_deletion : null,
          default_keyboard_removal: type === Type.DefaultKeyboardRemoval ? {} : null,
          x,
          y,
        };

        return action === 'edit' && actionID
          ? TelegramBotsService.updateAction({
              path: { telegramBotId: botID, id: actionID },
              body: data,
            })
          : TelegramBotsService.createAction({
              path: { telegramBotId: botID },
              body: data,
            });
      },
      getDiagramBlock: (id) =>
        TelegramBotsService.getDiagramAction({
          path: { telegramBotId: botID, id },
        }),
      onHide: () => hideOffcanvas(),
    }),
    [botID, actionID, action, hideOffcanvas, i18n.language],
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

export default memo(ActionOffcanvas);
