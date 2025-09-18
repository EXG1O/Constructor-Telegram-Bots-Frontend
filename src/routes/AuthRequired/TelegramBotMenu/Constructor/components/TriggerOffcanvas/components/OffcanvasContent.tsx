import React, { memo, ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'formik';

import { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Offcanvas from 'components/ui/Offcanvas';

import CommandBlock from './CommandBlock';
import MessageBlock from './MessageBlock';
import StartCommandBlock from './StartCommandBlock';
import TypeBlock from './TypeBlock';

import FormToggleSection from '../../FormToggleSection';
import NameBlock from '../../NameBlock';

import { useTriggerOffcanvasStore } from '../store';
import {
  getCommandBlockOpen,
  getMessageBlockOpen,
  getStartCommandBlockOpen,
} from '../utils';

function OffcanvasContent(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
    keyPrefix: 'triggerOffcanvas',
  });

  const action = useTriggerOffcanvasStore((state) => state.action);

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
          <FormToggleSection
            name='type'
            getOpen={getStartCommandBlockOpen}
            className='w-full'
          >
            <StartCommandBlock />
          </FormToggleSection>
          <FormToggleSection
            name='type'
            getOpen={getCommandBlockOpen}
            className='w-full'
          >
            <CommandBlock />
          </FormToggleSection>
          <FormToggleSection
            name='type'
            getOpen={getMessageBlockOpen}
            className='w-full'
          >
            <MessageBlock />
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
