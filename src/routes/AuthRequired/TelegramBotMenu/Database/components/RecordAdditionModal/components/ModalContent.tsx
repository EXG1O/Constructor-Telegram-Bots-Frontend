import React, { memo, ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'formik';

import { RouteID } from 'routes';

import FormCodeInputFeedback from 'components/shared/FormCodeInputFeedback';
import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';

function ModalContent(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuDatabase, {
    keyPrefix: 'records.recordAdditionModal',
  });

  const formID = useId();

  return (
    <Modal.Content>
      <Modal.Header closeButton>
        <Modal.Title>{t('title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body asChild>
        <Form id={formID}>
          <FormCodeInputFeedback language='json' name='data' />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button form={formID} type='submit' variant='success' className='w-full'>
          {t('addButton')}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
}

export default memo(ModalContent);
