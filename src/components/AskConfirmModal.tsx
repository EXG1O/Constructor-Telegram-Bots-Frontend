import React, { ReactElement, ReactNode, memo } from 'react';

import Button from 'react-bootstrap/Button';

import Modal, { ModalProps } from './Modal';

export interface AskConfirmModalProps extends Omit<ModalProps, 'children'> {
	title: string;
	children: ReactNode;
	onConfirm?: () => void;
	onCancel?: () => void;
}

function AskConfirmModal({
	title,
	children,
	onHide,
	onConfirm = onHide,
	onCancel = onHide,
	...props
}: AskConfirmModalProps): ReactElement<AskConfirmModalProps> {
	return (
		<Modal {...props} onHide={onHide}>
			<Modal.Header closeButton>
				<Modal.Title as='h5'>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>{children}</Modal.Body>
			<Modal.Footer className='gap-3'>
				<Button
					variant='success'
					className='flex-fill'
					onClick={() => onConfirm?.()}
				>
					{gettext('Да')}
				</Button>
				<Button
					variant='danger'
					className='flex-fill'
					onClick={() => onCancel?.()}
				>
					{gettext('Нет')}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default memo(AskConfirmModal);