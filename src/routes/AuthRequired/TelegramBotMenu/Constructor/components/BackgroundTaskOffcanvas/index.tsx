import React, { ReactElement, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Button from 'components/ui/Button';
import Offcanvas, { OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import APIRequestBlock, {
  APIRequest,
  defaultAPIRequest,
} from './components/APIRequestBlock';
import IntervalBlock, { defaultInterval, Interval } from './components/IntervalBlock';

import AddonButtonGroup from '../AddonButtonGroup';
import NameBlock, { defaultName, Name } from '../NameBlock';

import { BackgroundTaskAPI, BackgroundTasksAPI } from 'api/telegram_bots/main';
import { BackgroundTask, Data } from 'api/telegram_bots/types';

import { useBackgroundTaskOffcanvasStore } from './store';

export interface FormValues {
  name: Name;
  interval: Interval;
  api_request: APIRequest;

  show_api_request_block: boolean;
  show_api_request_headers_block: boolean;
  show_api_request_body_block: boolean;
}

type InnerBackgroundTaskOffcanvasProps = Pick<OffcanvasProps, 'className'>;

export const defaultFormValues: FormValues = {
  name: defaultName,
  interval: defaultInterval,
  api_request: defaultAPIRequest,

  show_api_request_block: false,
  show_api_request_headers_block: false,
  show_api_request_body_block: false,
};

function InnerBackgroundTaskOffcanvas(
  props: InnerBackgroundTaskOffcanvasProps,
): ReactElement<InnerBackgroundTaskOffcanvasProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor);

  const formID = useId();

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const taskID = useBackgroundTaskOffcanvasStore((state) => state.taskID);
  const type = useBackgroundTaskOffcanvasStore((state) => state.type);
  const show = useBackgroundTaskOffcanvasStore((state) => state.show);
  const loading = useBackgroundTaskOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useBackgroundTaskOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useBackgroundTaskOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (taskID) {
      (async () => {
        const response = await BackgroundTaskAPI.get(telegramBot.id, taskID);

        if (!response.ok) {
          hideOffcanvas();
          createMessageToast({
            message: t('backgroundTaskOffcanvas.messages.getBackgroundTask.error'),
            level: 'error',
          });
          return;
        }

        const { id, api_request, ...task } = response.json;

        setValues({
          ...task,
          api_request: api_request
            ? {
                ...api_request,
                headers: api_request.headers
                  ? api_request.headers.map((header) => {
                      const [[key, value]] = Object.entries(header);
                      return { key, value };
                    })
                  : defaultAPIRequest.headers,
                body: api_request.body
                  ? JSON.stringify(api_request.body, undefined, 4)
                  : defaultAPIRequest.body,
              }
            : defaultAPIRequest,

          show_api_request_block: Boolean(api_request),
          show_api_request_headers_block: Boolean(api_request?.headers),
          show_api_request_body_block: Boolean(api_request?.body),
        });
        setLoading(false);
      })();
    }
  }, [taskID]);

  function handleHidden(): void {
    resetForm();
  }

  return (
    <Offcanvas
      {...props}
      show={show}
      loading={isSubmitting || loading}
      className='background-task'
      onHide={hideOffcanvas}
      onHidden={handleHidden}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {t('backgroundTaskOffcanvas.title', { context: type })}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body asChild>
        <Form id={formID}>
          <NameBlock />
          <IntervalBlock />
          <APIRequestBlock />
        </Form>
      </Offcanvas.Body>
      <Offcanvas.Footer className='gap-2'>
        <AddonButtonGroup>
          <AddonButtonGroup.Button name='show_api_request_block'>
            {t('apiRequestBlock.title')}
          </AddonButtonGroup.Button>
        </AddonButtonGroup>
        <Button type='submit' form={formID} variant='success'>
          {t('backgroundTaskOffcanvas.actionButton', { context: type })}
        </Button>
      </Offcanvas.Footer>
    </Offcanvas>
  );
}

export interface BackgroundTaskOffcanvasProps
  extends InnerBackgroundTaskOffcanvasProps {
  onAdd?: (task: BackgroundTask) => void;
  onSave?: (task: BackgroundTask) => void;
}

function BackgroundTaskOffcanvas({
  onAdd,
  onSave,
  ...props
}: BackgroundTaskOffcanvasProps): ReactElement<BackgroundTaskOffcanvasProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'backgroundTaskOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const taskID = useBackgroundTaskOffcanvasStore((state) => state.taskID);
  const type = useBackgroundTaskOffcanvasStore((state) => state.type);
  const hideOffcanvas = useBackgroundTaskOffcanvasStore((state) => state.hideOffcanvas);

  async function handleSubmit(
    {
      api_request,
      show_api_request_block,
      show_api_request_headers_block,
      show_api_request_body_block,
      ...task
    }: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    let apiRequestBody: Record<string, any> | null = null;

    try {
      apiRequestBody = JSON.parse(api_request.body);
    } catch (error) {
      if (error instanceof SyntaxError) {
        setFieldError('api_request.body', t('messages.validation.invalidJSON'));
      }
      return;
    }

    const data: Data.BackgroundTasksAPI.Create | Data.BackgroundTaskAPI.Update = {
      ...task,
      api_request: show_api_request_block
        ? {
            ...api_request,
            headers: show_api_request_headers_block
              ? api_request.headers.map((header) => ({
                  [header.key]: header.value,
                }))
              : null,
            body: apiRequestBody,
          }
        : null,
    };

    const response = await (taskID
      ? BackgroundTaskAPI.update(telegramBot.id, taskID, data)
      : BackgroundTasksAPI.create(telegramBot.id, data));

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
      }
      createMessageToast({
        message: t(`messages.${type}BackgroundTask.error`),
        level: 'error',
      });
      return;
    }

    (taskID ? onSave : onAdd)?.(response.json);
    hideOffcanvas();
    createMessageToast({
      message: t(`messages.${type}BackgroundTask.success`),
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
      <InnerBackgroundTaskOffcanvas {...props} />
    </Formik>
  );
}

export default BackgroundTaskOffcanvas;
