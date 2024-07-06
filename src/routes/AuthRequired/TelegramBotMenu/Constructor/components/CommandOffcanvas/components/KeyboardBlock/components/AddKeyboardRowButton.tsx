import React, { memo, ReactElement } from 'react';

import Button, { ButtonProps } from 'react-bootstrap/Button';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type AddKeyboardRowButtonProps = Omit<
	ButtonProps,
	'size' | 'variant' | 'children' | 'onClick'
>;

function AddKeyboardRowButton(
	props: AddKeyboardRowButtonProps,
): ReactElement<AddKeyboardRowButtonProps> {
	const updateKeyboard = useCommandOffcanvasStore((state) => state.updateKeyboard);

	return (
		<Button
			{...props}
			size='sm'
			variant='dark'
			onClick={() =>
				updateKeyboard((keyboard) => {
					keyboard.rows.push({
						draggableId: crypto.randomUUID(),
						buttons: [],
					});
				})
			}
		>
			{gettext('Добавить ряд')}
		</Button>
	);
}

export default memo(AddKeyboardRowButton);
