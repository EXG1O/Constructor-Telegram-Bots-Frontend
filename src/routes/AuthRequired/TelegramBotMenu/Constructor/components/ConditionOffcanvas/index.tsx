import React, { ReactElement, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Button from 'components/ui/Button';
import Offcanvas, { OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import PartsBlock, {
  defaultPartsBlockFormValues,
  PartsBlockFormValues,
} from './components/PartsBlock';

import NameBlock, {
  defaultNameBlockFormValues,
  NameBlockFormValues,
} from '../NameBlock';

import { ConditionAPI, ConditionsAPI } from 'api/telegram_bots/main';
import { Condition, Data } from 'api/telegram_bots/types';

import { useConditionOffcanvasStore } from './store';

export interface FormValues extends NameBlockFormValues, PartsBlockFormValues {}

interface InnerConditionOffcanvasProps
  extends Omit<OffcanvasProps, 'show' | 'loading' | 'children' | 'onHide'> {}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultPartsBlockFormValues,
};

function InnerConditionOffcanvas({
  onHidden,
  ...props
}: InnerConditionOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'conditionOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const conditionID = useConditionOffcanvasStore((state) => state.conditionID);
  const type = useConditionOffcanvasStore((state) => state.type);
  const show = useConditionOffcanvasStore((state) => state.show);
  const loading = useConditionOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useConditionOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useConditionOffcanvasStore((state) => state.setLoading);

  const formID = useId();

  useEffect(() => {
    if (!conditionID) return;
    (async () => {
      const response = await ConditionAPI.get(telegramBot.id, conditionID);

      if (!response.ok) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getCondition.error'),
          level: 'error',
        });
        return;
      }

      const { id, parts, ...condition } = response.json;

      setValues({
        ...condition,
        parts: parts.map(({ next_part_operator, ...part }) => ({
          ...part,
          next_part_operator: next_part_operator ?? 'null',
        })),
      });
      setLoading(false);
    })();
  }, [conditionID]);

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
        <Form id={formID} className='flex flex-col gap-3'>
          <NameBlock />
          <PartsBlock />
        </Form>
      </Offcanvas.Body>
      <Offcanvas.Footer>
        <Button form={formID} type='submit' variant='success' className='w-full'>
          {t('actionButton', { context: type })}
        </Button>
      </Offcanvas.Footer>
    </Offcanvas>
  );
}

export interface ConditionFormOffcanvasProps extends InnerConditionOffcanvasProps {
  onAdd?: (condition: Condition) => void;
  onSave?: (condition: Condition) => void;
}

function ConditionOffcanvas({
  onAdd,
  onSave,
  ...props
}: ConditionFormOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'conditionOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const conditionID = useConditionOffcanvasStore((state) => state.conditionID);
  const type = useConditionOffcanvasStore((state) => state.type);
  const hideOffcanvas = useConditionOffcanvasStore((state) => state.hideOffcanvas);

  async function handleSubmit(
    { parts, ...values }: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    const data: Data.ConditionsAPI.Create | Data.ConditionAPI.Update = {
      ...values,
      parts: parts.map(({ next_part_operator, ...part }) => ({
        ...part,
        next_part_operator: next_part_operator !== 'null' ? next_part_operator : null,
      })),
    };

    const response = await (conditionID
      ? ConditionAPI.update(telegramBot.id, conditionID, data)
      : ConditionsAPI.create(telegramBot.id, data));

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;
        setFieldError(error.attr, error.detail);
      }
      createMessageToast({
        message: t(`messages.${type}Condition.error`),
        level: 'error',
      });
      return;
    }

    (conditionID ? onSave : onAdd)?.(response.json);
    hideOffcanvas();
    createMessageToast({
      message: t(`messages.${type}Condition.success`),
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
      <InnerConditionOffcanvas {...props} />
    </Formik>
  );
}

export default ConditionOffcanvas;
