import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { FormValues } from '..';

import Offcanvas, { OffcanvasProps } from 'components/ui/Offcanvas';
import { createMessageToast } from 'components/ui/ToastContainer';

import OffcanvasContent from './OffcanvasContent';

import { InvoiceAPI } from 'api/telegram-bots/invoice';
import fetchFile from 'api/utils/fetchFile';

import { useInvoiceOffcanvasStore } from '../store';

export interface OffcanvasInnerProps extends Omit<
  OffcanvasProps,
  'show' | 'loading' | 'children'
> {}

function OffcanvasInner({
  onHide,
  onHidden,
  ...props
}: OffcanvasInnerProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'invoiceOffcanvas',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

  const invoiceID = useInvoiceOffcanvasStore((state) => state.invoiceID);
  const show = useInvoiceOffcanvasStore((state) => state.show);
  const loading = useInvoiceOffcanvasStore((state) => state.loading);
  const hideOffcanvas = useInvoiceOffcanvasStore((state) => state.hideOffcanvas);
  const setLoading = useInvoiceOffcanvasStore((state) => state.setLoading);
  const setUsedStorageSize = useInvoiceOffcanvasStore(
    (state) => state.setUsedStorageSize,
  );

  useEffect(() => {
    if (!invoiceID) return;
    (async () => {
      const response = await InvoiceAPI.get(telegramBotID, invoiceID);

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

      const imageFile: File | null =
        image && image.url && image.name
          ? await fetchFile(image.url, image.name)
          : null;

      setValues({
        ...invoice,
        image: image && {
          file: imageFile,
          file_url: imageFile && URL.createObjectURL(imageFile),
          from_url: image.from_url,
        },
        price: { label: price.label, amount: price.amount.toString() },
        show_image_block: Boolean(image),
      });

      if (imageFile) {
        setUsedStorageSize(
          useTelegramBotStore.getState().telegramBot!.used_storage_size -
            imageFile.size,
        );
      }

      setLoading(false);
    })();
  }, [telegramBotID, invoiceID]);

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
