import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Button from 'components/ui/Button';
import Modal from 'components/ui/Modal';

import { useConfirmModalStore } from './store';

function ConfirmModal(): ReactElement {
  const { t } = useTranslation('components', { keyPrefix: 'confirmModal' });

  const { show, loading, title, text, onConfirm, onCancel, setHide } =
    useConfirmModalStore();

  const handleConfirm = onConfirm ?? setHide;
  const handleCancel = onCancel ?? setHide;

  return (
    <Modal show={show} loading={loading} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='text-foreground'>{text}</Modal.Body>
      <Modal.Footer className='flex flex-nowrap gap-4'>
        <Button variant='success' className='w-full' onClick={handleConfirm}>
          {t('yesButton')}
        </Button>
        <Button variant='danger' className='w-full' onClick={handleCancel}>
          {t('noButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
