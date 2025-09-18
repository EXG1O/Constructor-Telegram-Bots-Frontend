import React, { memo, ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'formik';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Offcanvas from 'components/ui/Offcanvas';

import IntervalBlock from './IntervalBlock';

import NameBlock from '../../NameBlock';

import { useBackgroundTaskOffcanvasStore } from '../store';

function OffcanvasContent(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'backgroundTaskOffcanvas',
  });

  const action = useBackgroundTaskOffcanvasStore((state) => state.action);

  const formID = useId();

  return (
    <>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{t('title', { context: action })}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body asChild>
        <Form id={formID} className='flex flex-col gap-3'>
          <NameBlock />
          <IntervalBlock />
        </Form>
      </Offcanvas.Body>
      <Offcanvas.Footer>
        <Button form={formID} type='submit' variant='success' className='w-full'>
          {t('actionButton', { context: action })}
        </Button>
      </Offcanvas.Footer>
    </>
  );
}

export default memo(OffcanvasContent);
