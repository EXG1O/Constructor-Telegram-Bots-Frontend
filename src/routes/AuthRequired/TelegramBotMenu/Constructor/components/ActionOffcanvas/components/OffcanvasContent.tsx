import React, { memo, type ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'formik';

import type { RouteID } from 'routes';

import Button from 'components/ui/Button';
import Offcanvas from 'components/ui/Offcanvas';

import MessageDeletionBlock from './MessageDeletionBlock';
import TypeBlock from './TypeBlock';
import { Type } from './TypeBlock/enums';

import FormToggleSection from '../../FormToggleSection';
import NameBlock from '../../NameBlock';

import { useActionOffcanvasStore } from '../store';

function OffcanvasContent(): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuConstructor}`, any>(
    'telegram-bot-menu-constructor',
    { keyPrefix: 'actionOffcanvas' },
  );

  const action = useActionOffcanvasStore((state) => state.action);

  const formID = useId();

  return (
    <>
      <Offcanvas.Body asChild>
        <Form id={formID}>
          <NameBlock className='mb-3' />
          <TypeBlock className='mb-3' />
          <FormToggleSection
            name='type'
            getOpen={(field) => field.value === Type.MessageDeletion}
            className='w-full'
          >
            <MessageDeletionBlock />
          </FormToggleSection>
        </Form>
      </Offcanvas.Body>
      <Offcanvas.Footer>
        <Button form={formID} type='submit' variant='success' className='w-full'>
          {t('actionButton', { context: action === 'edit' ? 'edit' : 'add' })}
        </Button>
      </Offcanvas.Footer>
    </>
  );
}

export default memo(OffcanvasContent);
