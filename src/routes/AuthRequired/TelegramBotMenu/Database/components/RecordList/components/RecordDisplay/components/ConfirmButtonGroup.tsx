import React, { ReactElement, memo } from 'react';

import ButtonGroup, { ButtonGroupProps } from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

export interface ConfirmButtonGroupProps extends Omit<ButtonGroupProps, 'children'> {
	onConfirm?: () => void;
	onCancel?: () => void;
}

function ConfirmButtonGroup({ onConfirm, onCancel, ...props }: ConfirmButtonGroupProps): ReactElement<ConfirmButtonGroupProps> {
	return (
		<ButtonGroup size='sm' {...props}>
			<Button
				as='i'
				variant='success'
				className='d-flex bi bi-check p-0'
				style={{ fontSize: '25px' }}
				onClick={onConfirm}
			/>
			<Button
				as='i'
				variant='danger'
				className='d-flex bi bi-x p-0'
				style={{ fontSize: '25px', WebkitTextStroke: '0.4px' }}
				onClick={onCancel}
			/>
		</ButtonGroup>
	);
}

export default memo(ConfirmButtonGroup);