import React, { memo, ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, FormikProps } from 'formik';

import { RouteID } from 'routes';

import { FormValues } from '..';

import Button from 'components/ui/Button';
import Offcanvas from 'components/ui/Offcanvas';

import DocumentsBlock from './DocumentsBlock';
import ImagesBlock from './ImagesBlock';
import KeyboardBlock from './KeyboardBlock';
import SettingsBlock from './SettingsBlock';
import TelegramBotStorage from './TelegramBotStorage';
import TextBlock from './TextBlock';

import AddonButtonGroup from '../../AddonButtonGroup';
import FormToggleSection from '../../FormToggleSection';
import NameBlock from '../../NameBlock';

import calcMediaSize from '../../../utils/calcMediaSize';
import { useMessageOffcanvasStore } from '../store';

function OffcanvasContent(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'messageOffcanvas',
  });

  const action = useMessageOffcanvasStore((state) => state.action);
  const setUsedStorageSize = useMessageOffcanvasStore(
    (state) => state.setUsedStorageSize,
  );

  const formID = useId();

  function handleMediaBlockOpenChange(
    form: FormikProps<FormValues>,
    open: boolean,
    field: keyof Pick<FormValues, 'images' | 'documents'>,
  ): void {
    const totalSize: number = calcMediaSize(form.values[field]);
    setUsedStorageSize((prev) => (open ? prev + totalSize : prev - totalSize));
  }

  return (
    <>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{t('title', { context: action })}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body asChild>
        <Form id={formID}>
          <NameBlock className='mb-3' />
          <SettingsBlock className='mb-3' />
          <FormToggleSection
            name='show_images_block'
            onOpenChange={(form, open) =>
              handleMediaBlockOpenChange(form, open, 'images')
            }
          >
            <ImagesBlock className='mb-3' />
          </FormToggleSection>
          <FormToggleSection
            name='show_documents_block'
            onOpenChange={(form, open) =>
              handleMediaBlockOpenChange(form, open, 'documents')
            }
          >
            <DocumentsBlock className='mb-3' />
          </FormToggleSection>
          <FormToggleSection name='show_text_block'>
            <TextBlock className='mb-3' />
          </FormToggleSection>
          <FormToggleSection name='show_keyboard_block'>
            <KeyboardBlock className='mb-3' />
          </FormToggleSection>
        </Form>
      </Offcanvas.Body>
      <Offcanvas.Footer className='flex flex-col gap-2'>
        <TelegramBotStorage />
        <AddonButtonGroup>
          <AddonButtonGroup.Button name='show_images_block'>
            {t('imagesBlock.title')}
          </AddonButtonGroup.Button>
          <AddonButtonGroup.Button name='show_documents_block'>
            {t('documentsBlock.title')}
          </AddonButtonGroup.Button>
          <AddonButtonGroup.Button name='show_text_block'>
            {t('textBlock.title')}
          </AddonButtonGroup.Button>
          <AddonButtonGroup.Button name='show_keyboard_block'>
            {t('keyboardBlock.title')}
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
