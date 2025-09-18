import React, { memo, ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'formik';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Offcanvas from 'components/ui/Offcanvas';

import CreateBlock from './CreateBlock';
import TypeBlock from './TypeBlock';
import UpdateBlock from './UpdateBlock';

import FormToggleSection from '../../FormToggleSection';
import NameBlock from '../../NameBlock';

import { useDatabaseOperationOffcanvasStore } from '../store';
import { getCreateBlockOpen, getUpdateBlockOpen } from '../utils';

function OffcanvasContent(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'databaseOperationOffcanvas',
  });

  const action = useDatabaseOperationOffcanvasStore((state) => state.action);

  const formID = useId();

  return (
    <>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{t('title', { context: action })}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body asChild>
        <Form id={formID}>
          <NameBlock className='mb-3' />
          <TypeBlock className='mb-3' />
          <FormToggleSection name='type' getOpen={getCreateBlockOpen}>
            <CreateBlock />
          </FormToggleSection>
          <FormToggleSection name='type' getOpen={getUpdateBlockOpen}>
            <UpdateBlock />
          </FormToggleSection>
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
