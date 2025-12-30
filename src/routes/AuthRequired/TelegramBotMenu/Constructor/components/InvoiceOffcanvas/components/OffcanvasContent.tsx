import React, { memo, ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'formik';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Offcanvas from 'components/ui/Offcanvas';

import DescriptionBlock from './DescriptionBlock';
import ImageBlock from './ImageBlock';
import PriceBlock from './PriceBlock';
import TelegramBotStorage from './TelegramBotStorage';
import TitleBlock from './TitleBlock';

import AddonButtonGroup from '../../AddonButtonGroup';
import FormToggleSection from '../../FormToggleSection';
import NameBlock from '../../NameBlock';

import { useInvoiceOffcanvasStore } from '../store';

function OffcanvasContent(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'invoiceOffcanvas',
  });

  const action = useInvoiceOffcanvasStore((state) => state.action);

  const formID = useId();

  return (
    <>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{t('title', { context: action })}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body asChild>
        <Form id={formID}>
          <NameBlock className='mb-3' />
          <TitleBlock className='mb-3' />
          <FormToggleSection name='show_image_block'>
            <ImageBlock className='mb-3' />
          </FormToggleSection>
          <DescriptionBlock className='mb-3' />
          <PriceBlock />
        </Form>
      </Offcanvas.Body>
      <Offcanvas.Footer className='flex flex-col gap-2'>
        <TelegramBotStorage />
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
