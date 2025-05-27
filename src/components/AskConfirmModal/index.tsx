import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Button from 'components/ui/Button';

import Modal from 'components/ui/Modal';

import { useAskConfirmModalStore } from './store';

function AskConfirmModal(): ReactElement {
  const { t } = useTranslation('components', { keyPrefix: 'askConfirmModal' });

  const { show, loading, title, text, onConfirm, onCancel, setHide } =
    useAskConfirmModalStore();

  const handleConfirm = onConfirm ?? setHide;
  const handleCancel = onCancel ?? setHide;

  return (
    <Modal show={show} loading={loading} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{text}</Modal.Body>
      <Modal.Footer>
        <Button variant='success' className='flex-fill' onClick={handleConfirm}>
          {t('yesButton')}
        </Button>
        <Button variant='danger' className='flex-fill' onClick={handleCancel}>
          {t('noButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default memo(AskConfirmModal);
