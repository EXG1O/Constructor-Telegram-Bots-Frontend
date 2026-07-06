import React, { memo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { defaultDescriptionBlockFormValues } from './components/DescriptionBlock/defaults';
import type { DescriptionBlockFormValues } from './components/DescriptionBlock/types';
import { defaultImageBlockFormValues } from './components/ImageBlock/defaults';
import type { ImageBlockFormValues } from './components/ImageBlock/types';
import OffcanvasInner, { type OffcanvasInnerProps } from './components/OffcanvasInner';
import { defaultPriceBlockFormValues } from './components/PriceBlock/defaults';
import type { PriceBlockFormValues } from './components/PriceBlock/types';
import { defaultTitleBlockFormValues } from './components/TitleBlock/defaults';
import type { TitleBlockFormValues } from './components/TitleBlock/types';

import { defaultNameBlockFormValues } from '../NameBlock/defaults';
import type { NameBlockFormValues } from '../NameBlock/types';

import useFormikSubmit from '../../hooks/useFormikSubmit';

import { DiagramInvoiceAPI, InvoiceAPI, InvoicesAPI } from 'api/telegram-bots/invoice';
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

export interface InvoiceOffcanvasProps extends OffcanvasInnerProps {}

function InvoiceOffcanvas(props: InvoiceOffcanvasProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'invoiceOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);
  const setTelegramBot = useTelegramBotStore((state) => state.setTelegramBot);

  const invoiceID = useInvoiceOffcanvasStore((state) => state.invoiceID);
  const action = useInvoiceOffcanvasStore((state) => state.action);
  const hideOffcanvas = useInvoiceOffcanvasStore((state) => state.hideOffcanvas);

  const handleSubmit = useFormikSubmit<Invoice, FormValues>(
    () => ({
      messages: {
        add: {
          success: t('messages.addInvoice.success'),
          error: t('messages.addInvoice.error'),
        },
        edit: {
          success: t('messages.editInvoice.success'),
          error: t('messages.editInvoice.error'),
        },
      },
      type: 'invoice',
      action,
      saveAPICall: async ({ image, price, show_image_block, ...values }) => {
        const data: Data.InvoicesAPI.Create | Data.InvoiceAPI.Update = {
          ...values,
          image:
            show_image_block && image
              ? { file: image.file, from_url: image.from_url }
              : null,
          prices: [{ label: price.label, amount: Number(price.amount) }],
        };

        const response = await (action === 'edit' && invoiceID
          ? InvoiceAPI.update(telegramBotID, invoiceID, data)
          : InvoicesAPI.create(telegramBotID, data));

        if (response.ok) {
          const { usedStorageSize } = useInvoiceOffcanvasStore.getState();

          setTelegramBot((telegramBot) => {
            telegramBot!.used_storage_size = usedStorageSize;
          });
        }

        return response;
      },
      diagramAPICall: (id) => DiagramInvoiceAPI.get(telegramBotID, id),
      onHide: () => hideOffcanvas(),
    }),
    [invoiceID, action, hideOffcanvas, i18n.language],
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

export default memo(InvoiceOffcanvas);
