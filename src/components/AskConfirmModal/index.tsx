import React, { ReactElement, memo } from 'react';

import Button from 'react-bootstrap/Button';

import Modal from '../Modal';

import { useAskConfirmModalStore } from './store';

function AskConfirmModal(): ReactElement {
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
			<Modal.Footer className='gap-3'>
				<Button variant='success' className='flex-fill' onClick={handleConfirm}>
					{gettext('Да')}
				</Button>
				<Button variant='danger' className='flex-fill' onClick={handleCancel}>
					{gettext('Нет')}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default memo(AskConfirmModal);
