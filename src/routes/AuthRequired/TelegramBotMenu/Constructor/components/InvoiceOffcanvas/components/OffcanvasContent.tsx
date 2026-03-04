import React, { memo, type ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, type FormikProps } from 'formik';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import StorageProgressBar from 'components/shared/StorageProgressBar';
import Button from 'components/ui/Button';
import Offcanvas from 'components/ui/Offcanvas';

import DescriptionBlock from './DescriptionBlock';
import ImageBlock from './ImageBlock';
import PriceBlock from './PriceBlock';
import TitleBlock from './TitleBlock';

import AddonButtonGroup from '../../AddonButtonGroup';
import FormToggleSection from '../../FormToggleSection';
import NameBlock from '../../NameBlock';

import type { FormValues } from '..';
import { useInvoiceOffcanvasStore } from '../store';

function OffcanvasContent(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'invoiceOffcanvas',
  });

  const storageSize = useTelegramBotStore((state) => state.telegramBot!.storage_size);

  const action = useInvoiceOffcanvasStore((state) => state.action);
  const usedStorageSize = useInvoiceOffcanvasStore((state) => state.usedStorageSize);
  const setUsedStorageSize = useInvoiceOffcanvasStore(
    (state) => state.setUsedStorageSize,
  );

  const formID = useId();

  function handleImageBlockOpenChange(
    form: FormikProps<FormValues>,
    open: boolean,
  ): void {
    const file: File | null = form.values.image?.file ?? null;
    if (file === null) return;
    setUsedStorageSize((prev) => (open ? prev + file.size : prev - file.size));
  }

  return (
    <>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{t('title', { context: action })}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body asChild>
        <Form id={formID}>
          <NameBlock className='mb-3' />
          <TitleBlock className='mb-3' />
          <FormToggleSection
            name='show_image_block'
            onOpenChange={handleImageBlockOpenChange}
          >
            <ImageBlock className='mb-3' />
          </FormToggleSection>
          <DescriptionBlock className='mb-3' />
          <PriceBlock />
        </Form>
      </Offcanvas.Body>
      <Offcanvas.Footer className='flex flex-col gap-2'>
        <StorageProgressBar
          size='sm'
          storageSize={storageSize}
          usedStorageSize={usedStorageSize}
        />
        <AddonButtonGroup>
          <AddonButtonGroup.Button name='show_image_block'>
            {t('imageBlock.title')}
          </AddonButtonGroup.Button>
        </AddonButtonGroup>
        <Button form={formID} type='submit' variant='success' className='w-full'>
          {t('actionButton', { context: action })}
        </Button>
      </Offcanvas.Footer>
    </>
  );
}

export default memo(OffcanvasContent);
