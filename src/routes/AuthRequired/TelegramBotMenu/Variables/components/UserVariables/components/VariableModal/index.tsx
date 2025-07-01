import React, { ReactElement, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import FormInputFeedback from 'components/shared/FormInputFeedback';
import FormRichInputFeedback from 'components/shared/FormRichInputFeedback';
import TelegramRichInputLayout, {
  FORMATS,
} from 'components/shared/TelegramRichInputLayout';
import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';
import { createMessageToast } from 'components/ui/ToastContainer';

import { VariableAPI, VariablesAPI } from 'api/telegram_bots/main';
import { Variable } from 'api/telegram_bots/types';

import { useVariableModalStore } from './store';

export interface FormValues {
  name: string;
  value: string;
  description: string;
}

export const defaultFormValues: FormValues = { name: '', value: '', description: '' };

function InnerVariableModal(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'user.variableModal',
  });

  const formId = useId();

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const variableID = useVariableModalStore((state) => state.variableID);
  const type = useVariableModalStore((state) => state.type);
  const show = useVariableModalStore((state) => state.show);
  const loading = useVariableModalStore((state) => state.loading);
  const hideModal = useVariableModalStore((state) => state.hideModal);
  const setLoading = useVariableModalStore((state) => state.setLoading);

  useEffect(() => {
    if (variableID) {
      (async () => {
        const response = await VariableAPI.get(telegramBot.id, variableID);

        if (!response.ok) {
          hideModal();
          createMessageToast({
            message: t('messages.getVariable.error'),
            level: 'error',
          });
          return;
        }

        const { id, ...variable } = response.json;

        setValues(variable);
        setLoading(false);
      })();
    }
  }, [variableID]);

  function handleHidden(): void {
    resetForm();
  }

  return (
    <Modal
      show={show}
      loading={isSubmitting || loading}
      onHide={hideModal}
      onHidden={handleHidden}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('title', { context: type })}</Modal.Title>
      </Modal.Header>
      <Modal.Body asChild>
        <Form id={formId} className='flex flex-col gap-2'>
          <FormInputFeedback name='name' placeholder={t('nameInput.placeholder')} />
          <FormRichInputFeedback
            name='value'
            height='220px'
            formats={FORMATS}
            placeholder={t('valueInput.placeholder')}
          >
            <TelegramRichInputLayout />
          </FormRichInputFeedback>
          <FormInputFeedback
            name='description'
            placeholder={t('descriptionInput.placeholder')}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type='submit' form={formId} variant='success' className='w-full'>
          {t('actionButton', { context: type })}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export interface VariableModalProps {
  onAdd?: (variable: Variable) => void;
  onSave?: (variable: Variable) => void;
}

function VariableModal({
  onAdd,
  onSave,
}: VariableModalProps): ReactElement<VariableModalProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'user.variableModal',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const variableID = useVariableModalStore((state) => state.variableID);
  const type = useVariableModalStore((state) => state.type);
  const hideModal = useVariableModalStore((state) => state.hideModal);

  async function handleSubmit(
    values: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    const response = await (variableID
      ? VariableAPI.update(telegramBot.id, variableID, values)
      : VariablesAPI.create(telegramBot.id, values));

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
      }
      createMessageToast({
        message: t(`messages.${type}Variable.error`),
        level: 'error',
      });
      return;
    }

    (variableID ? onSave : onAdd)?.(response.json);
    hideModal();
    createMessageToast({
      message: t(`messages.${type}Variable.success`),
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
      <InnerVariableModal />
    </Formik>
  );
}

export default VariableModal;
