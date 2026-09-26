import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { defaultBodyBlockFormValues } from './components/BodyBlock/defaults';
import type { BodyBlockFormValues } from './components/BodyBlock/types';
import { defaultHeadersBlockFormValues } from './components/HeadersBlock/defaults';
import type { HeadersBlockFormValues } from './components/HeadersBlock/types';
import { defaultMethodBlockFormValues } from './components/MethodBlock/defaults';
import type { MethodBlockFormValues } from './components/MethodBlock/types';
import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';
import { defaultURLBlockFormValues } from './components/URLBlock/defaults';
import type { URLBlockFormValues } from './components/URLBlock/types';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import useFormikSubmit from '../../hooks/useFormikSubmit';

import type { ApiRequest, ApiRequestRequestWritable } from 'api';
import { TelegramBotsService } from 'api';

import { NodeType } from '../../enums';
import parseJsonField from '../../utils/parseJsonField';
import { useAPIRequestOffcanvasStore } from './store';
import { convertHeadersToRecord, getBodyBlockOpen } from './utils';

export interface FormValues
  extends
    NameBlockFormValues,
    URLBlockFormValues,
    MethodBlockFormValues,
    HeadersBlockFormValues,
    BodyBlockFormValues {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultURLBlockFormValues,
  ...defaultMethodBlockFormValues,
  ...defaultHeadersBlockFormValues,
  ...defaultBodyBlockFormValues,
};

export interface APIRequestOffcanvasProps extends OffcanvasInnerProps {}

function APIRequestOffcanvas(props: APIRequestOffcanvasProps): ReactElement {
  const { t, i18n } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'apiRequestOffcanvas' },
  );

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const requestID = useAPIRequestOffcanvasStore((state) => state.requestID);
  const action = useAPIRequestOffcanvasStore((state) => state.action);
  const hideOffcanvas = useAPIRequestOffcanvasStore((state) => state.hideOffcanvas);

  const handleSubmit = useFormikSubmit<ApiRequest, FormValues>(
    () => ({
      messages: {
        add: {
          success: t('messages.addAPIRequest.success'),
          error: t('messages.addAPIRequest.error'),
        },
        edit: {
          success: t('messages.editAPIRequest.success'),
          error: t('messages.editAPIRequest.error'),
        },
      },
      type: NodeType.ApiRequest,
      action,
      saveAPICall: async ({ headers, ...values }, { setFieldError }) => {
        let body: Record<string, any> | null = null;

        if (getBodyBlockOpen(values.method)) {
          body = parseJsonField(values.body, 'body', setFieldError);
          if (!body) return null;
        }

        const data: ApiRequestRequestWritable = {
          ...values,
          headers: convertHeadersToRecord(headers),
          body,
        };

        return action === 'edit' && requestID
          ? TelegramBotsService.updateApiRequest({
              path: { telegramBotId: telegramBotID, id: requestID },
              body: data,
            })
          : TelegramBotsService.createApiRequest({
              path: { telegramBotId: telegramBotID },
              body: data,
            });
      },
      diagramAPICall: (id) =>
        TelegramBotsService.getDiagramApiRequest({
          path: { telegramBotId: telegramBotID, id },
        }),
      onHide: () => hideOffcanvas(),
    }),
    [requestID, action, hideOffcanvas, i18n.language],
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

export default memo(APIRequestOffcanvas);
