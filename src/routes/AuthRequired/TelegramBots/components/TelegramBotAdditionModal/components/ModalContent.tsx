import React, { memo, ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'formik';

import { RouteID } from 'routes';

import FormCheckFeedback from 'components/shared/FormCheckFeedback';
import FormSimpleInputFeedback from 'components/shared/FormSimpleInputFeedback';
import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';

function ModalContent(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBots, {
    keyPrefix: 'telegramBotAdditionModal',
  });

  const formID = useId();

  return (
    <Modal.Content>
      <Modal.Header closeButton>
        <Modal.Title>{t('title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body asChild>
        <Form id={formID} className='flex flex-col gap-2'>
          <FormSimpleInputFeedback
            name='api_token'
            placeholder={t('apiTokenInputPlaceholder')}
          />
          <FormCheckFeedback
            type='switch'
            name='is_private'
            label={t('privateSwitchLabel')}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type='submit' form={formID} variant='success' className='w-full'>
          {t('addButton')}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
}

export default memo(ModalContent);
