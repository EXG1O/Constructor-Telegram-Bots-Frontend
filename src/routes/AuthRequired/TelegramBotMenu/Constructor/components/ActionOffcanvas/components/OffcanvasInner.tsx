import React, { lazy, type ReactElement, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Offcanvas, { type OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import { Type } from './TypeBlock/enums';

import { defaultMessageDeletion } from '../components/MessageDeletionBlock/defaults';
import { defaultType } from '../components/TypeBlock/defaults';

import { TelegramBotsService } from 'api';

import composeHandlers from 'utils/composeHandlers';

import type { FormValues } from '..';
import { useActionOffcanvasStore } from '../store';

const OffcanvasContent = lazy(() => import('./OffcanvasContent'));

export interface OffcanvasInnerProps extends Omit<
  OffcanvasProps,
  'show' | 'loading' | 'children'
> {}

function OffcanvasInner({
  onHide,
  onHidden,
  ...props
}: OffcanvasInnerProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'actionOffcanvas' },
  );

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, setSubmitting, resetForm } =
    useFormikContext<FormValues>();

  const actionID = useActionOffcanvasStore((state) => state.id);
  const action = useActionOffcanvasStore((state) => state.action);
  const show = useActionOffcanvasStore((state) => state.show);
  const hideOffcanvas = useActionOffcanvasStore((state) => state.hideOffcanvas);

  useEffect(() => {
    if (!actionID) return;
    (async () => {
      setSubmitting(true);
      const { data, error } = await TelegramBotsService.getAction({
        path: { telegramBotId: botID, id: actionID },
      });

      if (error || !data) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getAction.error'),
          level: 'error',
        });
        return;
      }

      const { name, message_deletion } = data;

      setValues({
        name,
        type: message_deletion ? Type.MessageDeletion : defaultType,
        message_deletion: message_deletion ?? defaultMessageDeletion,
      });
      setSubmitting(false);
    })();
  }, [botID, actionID]);

  return (
    <Offcanvas
      {...props}
      show={show}
      loading={isSubmitting}
      onHide={composeHandlers(hideOffcanvas, onHide)}
      onHidden={composeHandlers(resetForm, onHidden)}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {t('title', { context: action === 'edit' ? 'edit' : 'add' })}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Suspense fallback={!isSubmitting && <Offcanvas.Loading />}>
        <OffcanvasContent />
      </Suspense>
    </Offcanvas>
  );
}

export default OffcanvasInner;
