import React, { memo, type ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'formik';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Offcanvas from 'components/ui/Offcanvas';

import DurationBlock from './DurationBlock';

import NameBlock from '../../NameBlock';

import { useTimerOffcanvasStore } from '../store';

function OffcanvasContent(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'timerOffcanvas',
  });

  const action = useTimerOffcanvasStore((state) => state.action);

  const formID = useId();

  return (
    <>
      <Offcanvas.Body asChild>
        <Form id={formID} className='flex flex-col gap-3'>
          <NameBlock />
          <DurationBlock />
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
