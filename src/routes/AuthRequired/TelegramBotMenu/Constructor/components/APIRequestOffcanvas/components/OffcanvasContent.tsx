import React, { memo, ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'formik';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Offcanvas from 'components/ui/Offcanvas';

import BodyBlock from './BodyBlock';
import HeadersBlock from './HeadersBlock';
import MethodBlock from './MethodBlock';
import TestBlock from './TestBlock';
import URLBlock from './URLBlock';

import FormToggleSection from '../../FormToggleSection';
import NameBlock from '../../NameBlock';

import { useAPIRequestOffcanvasStore } from '../store';
import { getBodyBlockOpen } from '../utils';

function OffcanvasContent(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'apiRequestOffcanvas',
  });

  const action = useAPIRequestOffcanvasStore((state) => state.action);

  const formID = useId();

  return (
    <>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{t('title', { context: action })}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body asChild>
        <Form id={formID}>
          <NameBlock className='mb-3' />
          <URLBlock className='mb-3' />
          <MethodBlock className='mb-3' />
          <HeadersBlock className='mb-3' />
          <FormToggleSection name='method' getOpen={getBodyBlockOpen}>
            <BodyBlock className='mb-3' />
          </FormToggleSection>
          <TestBlock />
        </Form>
      </Offcanvas.Body>
      <Offcanvas.Footer className='flex flex-col gap-2'>
        <Button form={formID} type='submit' variant='success' className='w-full'>
          {t('actionButton', { context: action })}
        </Button>
      </Offcanvas.Footer>
    </>
  );
}

export default memo(OffcanvasContent);
