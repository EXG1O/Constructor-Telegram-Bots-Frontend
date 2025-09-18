import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { createMessageToast } from 'components/ui/ToastContainer';

import {
  BodyBlockFormValues,
  defaultBodyBlockFormValues,
} from './components/BodyBlock';
import {
  defaultHeadersBlockFormValues,
  HeadersBlockFormValues,
} from './components/HeadersBlock';
import {
  defaultMethodBlockFormValues,
  MethodBlockFormValues,
} from './components/MethodBlock';
import OffcanvasInner, { OffcanvasInnerProps } from './components/OffcanvasInner';
import { defaultURLBlockFormValues, URLBlockFormValues } from './components/URLBlock';

import { defaultNameBlockFormValues, NameBlockFormValues } from '../NameBlock';

import { APIRequestAPI, APIRequestsAPI } from 'api/telegram-bots/api-request';
import { APIRequest, Data } from 'api/telegram-bots/api-request/types';

import parseJsonField from '../../utils/parseJsonField';
import { useAPIRequestOffcanvasStore } from './store';
import { convertHeadersToRecord, getBodyBlockOpen } from './utils';

export interface FormValues
  extends NameBlockFormValues,
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

export interface APIRequestOffcanvasProps extends OffcanvasInnerProps {
  onAdd?: (request: APIRequest) => void;
  onSave?: (request: APIRequest) => void;
}

function APIRequestOffcanvas({
  onAdd,
  onSave,
  ...props
}: APIRequestOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const requestID = useAPIRequestOffcanvasStore((state) => state.requestID);
  const action = useAPIRequestOffcanvasStore((state) => state.action);
  const hideOffcanvas = useAPIRequestOffcanvasStore((state) => state.hideOffcanvas);

  async function handleSubmit(
    { headers, ...values }: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    let body: Record<string, any> | null = null;

    if (getBodyBlockOpen(values.method)) {
      body = parseJsonField(values.body, 'body', setFieldError);
      if (!body) return;
    }

    const data: Data.APIRequestsAPI.Create | Data.APIRequestAPI.Update = {
      ...values,
      headers: convertHeadersToRecord(headers),
      body,
    };

    const response = await (requestID
      ? APIRequestAPI.update(telegramBot.id, requestID, data)
      : APIRequestsAPI.create(telegramBot.id, data));

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
      }
      createMessageToast({
        message: t(`messages.${action}APIRequest.error`),
        level: 'error',
      });
      return;
    }

    (requestID ? onSave : onAdd)?.(response.json);
    hideOffcanvas();
    createMessageToast({
      message: t(`messages.${action}APIRequest.success`),
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

export default memo(APIRequestOffcanvas);
