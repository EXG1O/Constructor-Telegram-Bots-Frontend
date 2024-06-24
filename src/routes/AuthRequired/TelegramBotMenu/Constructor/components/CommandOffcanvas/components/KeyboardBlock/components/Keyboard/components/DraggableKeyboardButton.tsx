import React, { HTMLAttributes, ReactElement, memo } from 'react';

import classNames from 'classnames';

import { Draggable } from 'react-beautiful-dnd';

import useCommandOffcanvasStore from '../../../../../hooks/useCommandOffcanvasStore';

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
	const button = useCommandOffcanvasStore(
		(state) => state.keyboard.rows[rowIndex].buttons[buttonIndex],
	);
	const disabled = useCommandOffcanvasStore(
		(state) =>
			state.keyboardRowIndex === rowIndex &&
			state.keyboardButtonIndex === buttonIndex,
	);
	const edit = useCommandOffcanvasStore((state) => state.showEditKeyboardButtonBlock);

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
						{ 'text-bg-dark': !disabled, 'text-bg-secondary': disabled },
						className,
					)}
					onClick={!disabled ? () => edit(rowIndex, buttonIndex) : undefined}
				>
					{button.text}
				</small>
			)}
		</Draggable>
	);
}

export default memo(DraggableKeyboardButton);
