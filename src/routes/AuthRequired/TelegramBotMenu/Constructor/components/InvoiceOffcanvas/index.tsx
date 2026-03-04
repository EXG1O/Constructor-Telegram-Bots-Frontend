import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, type FormikHelpers } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { createMessageToast } from 'components/ui/ToastContainer';

import {
  defaultDescriptionBlockFormValues,
  type DescriptionBlockFormValues,
} from './components/DescriptionBlock';
import {
  defaultImageBlockFormValues,
  type ImageBlockFormValues,
} from './components/ImageBlock';
import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';
import {
  defaultPriceBlockFormValues,
  type PriceBlockFormValues,
} from './components/PriceBlock';
import {
  defaultTitleBlockFormValues,
  type TitleBlockFormValues,
} from './components/TitleBlock';

import { defaultNameBlockFormValues, type NameBlockFormValues } from '../NameBlock';

import { InvoiceAPI, InvoicesAPI } from 'api/telegram-bots/invoice';
import type { Data, Invoice } from 'api/telegram-bots/invoice/types';

import { useInvoiceOffcanvasStore } from './store';

export interface FormValues
  extends
    NameBlockFormValues,
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

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);
  const setTelegramBot = useTelegramBotStore((state) => state.setTelegramBot);

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
      ? InvoiceAPI.update(telegramBotID, invoiceID, data)
      : InvoicesAPI.create(telegramBotID, data));

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

    const { usedStorageSize } = useInvoiceOffcanvasStore.getState();

    (invoiceID ? onSave : onAdd)?.(response.json);
    setTelegramBot((telegramBot) => {
      telegramBot!.used_storage_size = usedStorageSize;
    });
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
