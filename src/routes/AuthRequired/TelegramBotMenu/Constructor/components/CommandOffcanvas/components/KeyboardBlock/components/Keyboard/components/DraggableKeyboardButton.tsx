import React, { HTMLAttributes, memo, ReactElement } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import classNames from 'classnames';
import { useField } from 'formik';

import { useCommandOffcanvasStore } from '../../../../../store';

export interface KeyboardButton {
	id?: number;
	draggableId: string;
	text: string;
	url: string | null;
}

export interface DraggableKeyboardButtonProps
	extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
	rowIndex: number;
	buttonIndex: number;
}

function DraggableKeyboardButton({
	rowIndex,
	buttonIndex,
	className,
	...props
}: DraggableKeyboardButtonProps): ReactElement<DraggableKeyboardButtonProps> {
	const [{ value: button }] = useField<KeyboardButton>(
		`keyboard.rows[${rowIndex}].buttons[${buttonIndex}]`,
	);

	const select = useCommandOffcanvasStore(
		(state) =>
			state.keyboardButtonBlock.rowIndex === rowIndex &&
			state.keyboardButtonBlock.buttonIndex === buttonIndex,
	);
	const showEditButtonBlock = useCommandOffcanvasStore(
		(state) => state.keyboardButtonBlock.showBlock,
	);
	const hideEditButtonBlock = useCommandOffcanvasStore(
		(state) => state.keyboardButtonBlock.hideBlock,
	);

	return (
		<Draggable index={buttonIndex} draggableId={button.draggableId}>
			{({ innerRef, draggableProps, dragHandleProps }) => (
				<small
					ref={innerRef}
					{...props}
					{...draggableProps}
					{...dragHandleProps}
					className={classNames(
						'rounded-1 text-center px-2 py-1',
						{ 'text-bg-dark': !select, 'text-bg-secondary': select },
						className,
					)}
					onClick={() =>
						select
							? hideEditButtonBlock()
							: showEditButtonBlock(
									{ ...button, url: button.url ?? '' },
									rowIndex,
									buttonIndex,
								)
					}
				>
					{button.text}
				</small>
			)}
		</Draggable>
	);
}

export default memo(DraggableKeyboardButton);
