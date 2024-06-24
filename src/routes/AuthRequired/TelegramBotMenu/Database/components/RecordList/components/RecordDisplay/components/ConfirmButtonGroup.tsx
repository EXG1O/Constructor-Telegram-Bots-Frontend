import React, { ReactElement, memo } from 'react';

import Button from 'react-bootstrap/Button';
import ButtonGroup, { ButtonGroupProps } from 'react-bootstrap/ButtonGroup';

import CheckIcon from 'assets/icons/check.svg';
import XIcon from 'assets/icons/x.svg';

export interface ConfirmButtonGroupProps extends Omit<ButtonGroupProps, 'children'> {
	onConfirm?: () => void;
	onCancel?: () => void;
}

function ConfirmButtonGroup({
	onConfirm,
	onCancel,
	...props
}: ConfirmButtonGroupProps): ReactElement<ConfirmButtonGroupProps> {
	return (
		<ButtonGroup size='sm' {...props}>
			<Button variant='success' className='d-flex p-0' onClick={onConfirm}>
				<CheckIcon width={25} height={25} />
			</Button>
			<Button variant='danger' className='d-flex p-0' onClick={onCancel}>
				<XIcon width={25} height={25} />
			</Button>
		</ButtonGroup>
	);
}

export default memo(ConfirmButtonGroup);
