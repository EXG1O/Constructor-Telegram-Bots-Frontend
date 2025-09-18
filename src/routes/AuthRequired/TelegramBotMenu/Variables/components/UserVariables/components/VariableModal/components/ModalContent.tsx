import React, { memo, ReactElement, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'formik';

import { RouteID } from 'routes';

import FormRichInputFeedback from 'components/shared/FormRichInputFeedback';
import FormSimpleInputFeedback from 'components/shared/FormSimpleInputFeedback';
import TelegramRichInputLayout, {
  FORMATS,
} from 'components/shared/TelegramRichInputLayout';
import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';

import { useVariableModalStore } from '../store';

function ModalContent(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'user.variableModal',
  });

  const action = useVariableModalStore((state) => state.action);

  const formID = useId();

  return (
    <Modal.Content>
      <Modal.Header closeButton>
        <Modal.Title>{t('title', { context: action })}</Modal.Title>
      </Modal.Header>
      <Modal.Body asChild>
        <Form id={formID} className='flex flex-col gap-2'>
          <FormSimpleInputFeedback
            name='name'
            placeholder={t('nameInput.placeholder')}
          />
          <FormRichInputFeedback
            name='value'
            height='220px'
            formats={FORMATS}
            placeholder={t('valueInput.placeholder')}
          >
            <TelegramRichInputLayout />
          </FormRichInputFeedback>
          <FormSimpleInputFeedback
            name='description'
            placeholder={t('descriptionInput.placeholder')}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type='submit' form={formID} variant='success' className='w-full'>
          {t('actionButton', { context: action })}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
}

export default memo(ModalContent);
