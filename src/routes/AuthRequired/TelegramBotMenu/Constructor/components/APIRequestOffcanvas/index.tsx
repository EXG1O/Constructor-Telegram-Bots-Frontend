import React, { ReactElement, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Button from 'components/ui/Button';
import Offcanvas, { OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import BodyBlock, {
  BodyBlockFormValues,
  defaultBody,
  defaultBodyBlockFormValues,
} from './components/BodyBlock';
import HeadersBlock, {
  defaultHeaders,
  defaultHeadersBlockFormValues,
  HeadersBlockFormValues,
} from './components/HeadersBlock';
import MethodBlock, {
  defaultMethodBlockFormValues,
  MethodBlockFormValues,
} from './components/MethodBlock';
import TestBlock from './components/TestBlock';
import URLBlock, {
  defaultURLBlockFormValues,
  URLBlockFormValues,
} from './components/URLBlock';

import FormToggleSection from '../FormToggleSection';
import NameBlock, {
  defaultNameBlockFormValues,
  NameBlockFormValues,
} from '../NameBlock';

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

interface InnerAPIRequestOffcanvasProps
  extends Omit<OffcanvasProps, 'show' | 'loading' | 'children' | 'onHide'> {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultURLBlockFormValues,
  ...defaultMethodBlockFormValues,
  ...defaultHeadersBlockFormValues,
  ...defaultBodyBlockFormValues,
};

function InnerAPIRequestOffcanvas({
  onHidden,
  ...props
}: InnerAPIRequestOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const requestID = useAPIRequestOffcanvasStore((state) => state.requestID);
  const type = useAPIRequestOffcanvasStore((state) => state.type);
  const show = useAPIRequestOffcanvasStore((state) => state.show);
  const loading = useAPIRequestOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useAPIRequestOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useAPIRequestOffcanvasStore((state) => state.setLoading);

  const formID = useId();

  useEffect(() => {
    if (!requestID) return;
    (async () => {
      const response = await APIRequestAPI.get(telegramBot.id, requestID);

      if (!response.ok) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getAPIRequest.error'),
          level: 'error',
        });
        return;
      }

      const { id, headers, body, ...request } = response.json;

      setValues({
        ...request,
        headers: headers
          ? Object.entries(headers).map(([key, value]) => ({ key, value }))
          : defaultHeaders,
        body: body ? JSON.stringify(body, undefined, 2) : defaultBody,
      });
      setLoading(false);
    })();
  }, [requestID]);

  function handleHidden(): void {
    resetForm();
    onHidden?.();
  }

  return (
    <Offcanvas
      {...props}
      show={show}
      loading={isSubmitting || loading}
      onHide={hideOffcanvas}
      onHidden={handleHidden}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{t('title', { context: type })}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body asChild>
        <Form id={formID}>
          <NameBlock className='mb-3' />
          <URLBlock className='mb-3' />
          <MethodBlock className='mb-3' />
          <HeadersBlock className='mb-3' />
          <FormToggleSection name='method' getOpen={getBodyBlockOpen}>
            <BodyBlock className='mb-3' />
          </FormToggleSection>
          <TestBlock />
        </Form>
      </Offcanvas.Body>
      <Offcanvas.Footer className='flex flex-col gap-2'>
        <Button form={formID} type='submit' variant='success' className='w-full'>
          {t('actionButton', { context: type })}
        </Button>
      </Offcanvas.Footer>
    </Offcanvas>
  );
}

export interface APIRequestOffcanvasProps extends InnerAPIRequestOffcanvasProps {
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
  const type = useAPIRequestOffcanvasStore((state) => state.type);
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
        message: t(`messages.${type}APIRequest.error`),
        level: 'error',
      });
      return;
    }

    (requestID ? onSave : onAdd)?.(response.json);
    hideOffcanvas();
    createMessageToast({
      message: t(`messages.${type}APIRequest.success`),
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
      <InnerAPIRequestOffcanvas {...props} />
    </Formik>
  );
}

export default APIRequestOffcanvas;
