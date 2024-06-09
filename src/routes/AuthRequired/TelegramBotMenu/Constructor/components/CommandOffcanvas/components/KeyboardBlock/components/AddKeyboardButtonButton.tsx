import React, { ReactElement, memo } from 'react';

import Button, { ButtonProps } from 'react-bootstrap/Button';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type AddKeyboardButtonButtonProps = Omit<
	ButtonProps,
	'size' | 'variant' | 'children' | 'onClick'
>;

function AddKeyboardButtonButton(
	props: AddKeyboardButtonButtonProps,
): ReactElement<AddKeyboardButtonButtonProps> {
	const disabled = useCommandOffcanvasStore(
		(state) =>
			state.showKeyboardButtonBlock && state.keyboardButtonBlockType === 'add',
	);
	const showAddKeyboardButtonBlock = useCommandOffcanvasStore(
		(state) => state.showAddKeyboardButtonBlock,
	);

	return (
		<Button
			{...props}
			size='sm'
			variant='dark'
			disabled={disabled}
			onClick={() => showAddKeyboardButtonBlock()}
		>
			{gettext('Добавить кнопку')}
		</Button>
	);
}

export default memo(AddKeyboardButtonButton);
