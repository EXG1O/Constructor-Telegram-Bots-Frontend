import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { FormValues } from '..';

import Offcanvas, { OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import OffcanvasContent from './OffcanvasContent';

import { InvoiceAPI } from 'api/telegram-bots/invoice';

import { useInvoiceOffcanvasStore } from '../store';

export interface OffcanvasInnerProps
  extends Omit<OffcanvasProps, 'show' | 'loading' | 'children'> {}

function OffcanvasInner({
  onHide,
  onHidden,
  ...props
}: OffcanvasInnerProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'invoiceOffcanvas',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const invoiceID = useInvoiceOffcanvasStore((state) => state.invoiceID);
  const show = useInvoiceOffcanvasStore((state) => state.show);
  const loading = useInvoiceOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useInvoiceOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useInvoiceOffcanvasStore((state) => state.setLoading);

  useEffect(() => {
    if (!invoiceID) return;
    (async () => {
      const response = await InvoiceAPI.get(telegramBot.id, invoiceID);

      if (!response.ok) {
        hideOffcanvas();
        createMessageToast({
          message: t('messages.getInvoice.error'),
          level: 'error',
        });
        return;
      }

      const {
        id,
        image,
        prices: [price],
        ...invoice
      } = response.json;

      setValues({
        ...invoice,
        image: image && {
          name: (image.name ?? image.from_url)!,
          size: image.size ?? 0,
          url: (image.url ?? image.from_url)!,
          file: null,
          from_url: image.from_url,
        },
        price: { label: price.label, amount: price.amount.toString() },
        show_image_block: Boolean(image),
      });
      setLoading(false);
    })();
  }, [telegramBot, invoiceID]);

  function handleHide(): void {
    hideOffcanvas();
    onHide?.();
  }

  function handleHidden(): void {
    resetForm();
    onHidden?.();
  }

  return (
    <Offcanvas
      {...props}
      show={show}
      loading={isSubmitting || loading}
      onHide={handleHide}
      onHidden={handleHidden}
    >
      <OffcanvasContent />
    </Offcanvas>
  );
}

export default OffcanvasInner;
