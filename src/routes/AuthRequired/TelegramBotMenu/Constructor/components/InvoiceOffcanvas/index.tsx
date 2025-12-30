import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, FormikHelpers } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { createMessageToast } from 'components/ui/ToastContainer';

import {
  defaultDescriptionBlockFormValues,
  DescriptionBlockFormValues,
} from './components/DescriptionBlock';
import {
  defaultImageBlockFormValues,
  ImageBlockFormValues,
} from './components/ImageBlock';
import OffcanvasInner, { OffcanvasInnerProps } from './components/OffcanvasInner';
import {
  defaultPriceBlockFormValues,
  PriceBlockFormValues,
} from './components/PriceBlock';
import {
  defaultTitleBlockFormValues,
  TitleBlockFormValues,
} from './components/TitleBlock';

import { defaultNameBlockFormValues, NameBlockFormValues } from '../NameBlock';

import { InvoiceAPI, InvoicesAPI } from 'api/telegram-bots/invoice';
import { Data, Invoice } from 'api/telegram-bots/invoice/types';

import { useInvoiceOffcanvasStore } from './store';

export interface FormValues
  extends NameBlockFormValues,
    TitleBlockFormValues,
    ImageBlockFormValues,
    DescriptionBlockFormValues,
    PriceBlockFormValues {
  show_image_block: boolean;
}

export const defaultFormValues: FormValues = {
  ...defaultNameBlockFormValues,
  ...defaultTitleBlockFormValues,
  ...defaultImageBlockFormValues,
  ...defaultDescriptionBlockFormValues,
  ...defaultPriceBlockFormValues,

  show_image_block: false,
};

export interface InvoiceOffcanvasProps extends OffcanvasInnerProps {
  onAdd?: (invoice: Invoice) => void;
  onSave?: (invoice: Invoice) => void;
}

function InvoiceOffcanvas({
  onAdd,
  onSave,
  ...props
}: InvoiceOffcanvasProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'invoiceOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const invoiceID = useInvoiceOffcanvasStore((state) => state.invoiceID);
  const action = useInvoiceOffcanvasStore((state) => state.action);
  const hideOffcanvas = useInvoiceOffcanvasStore((state) => state.hideOffcanvas);

  async function handleSubmit(
    { image, price, show_image_block, ...values }: FormValues,
    { setFieldError }: FormikHelpers<FormValues>,
  ): Promise<void> {
    const data: Data.InvoicesAPI.Create | Data.InvoiceAPI.Update = {
      ...values,
      image:
        show_image_block && image
          ? { file: image.file, from_url: image.from_url }
          : null,
      prices: [{ label: price.label, amount: Number(price.amount) }],
    };

    const response = await (invoiceID
      ? InvoiceAPI.update(telegramBot.id, invoiceID, data)
      : InvoicesAPI.create(telegramBot.id, data));

    if (!response.ok) {
      for (const error of response.json.errors) {
        if (!error.attr) continue;

        const fieldName: string = error.attr.startsWith('prices.0')
          ? error.attr.replace('prices.0', 'price')
          : error.attr;

        setFieldError(fieldName, error.detail);
      }
      createMessageToast({
        message: t(`messages.${action}Invoice.error`),
        level: 'error',
      });
      return;
    }

    (invoiceID ? onSave : onAdd)?.(response.json);
    hideOffcanvas();
    createMessageToast({
      message: t(`messages.${action}Invoice.success`),
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

export default memo(InvoiceOffcanvas);
