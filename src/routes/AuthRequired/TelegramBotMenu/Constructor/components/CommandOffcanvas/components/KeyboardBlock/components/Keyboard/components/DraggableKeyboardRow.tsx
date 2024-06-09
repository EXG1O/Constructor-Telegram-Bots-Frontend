import React, { ReactElement, memo } from 'react';

import { Draggable, DraggableProps } from 'react-beautiful-dnd';

import DroppableKeyboardButtons from './DroppableKeyboardButtons';
import { KeyboardButton } from './DraggableKeyboardButton';

import useCommandOffcanvasStore from '../../../../../hooks/useCommandOffcanvasStore';

export interface KeyboardRow {
	draggableId: string;
	buttons: KeyboardButton[];
}

export interface DraggableKeyboardRowProps
	extends Omit<DraggableProps, 'draggableId' | 'index' | 'children'> {
	rowIndex: number;
}

function DraggableKeyboardRow({
	rowIndex,
	...props
}: DraggableKeyboardRowProps): ReactElement<DraggableKeyboardRowProps> {
	const row = useCommandOffcanvasStore((state) => state.keyboard.rows[rowIndex]);
	const deleteRow = useCommandOffcanvasStore((state) => state.deleteKeyboardRow);

	return (
		<Draggable {...props} draggableId={row.draggableId} index={rowIndex}>
			{({ innerRef, draggableProps, dragHandleProps }) => (
				<div
					ref={innerRef}
					{...draggableProps}
					{...dragHandleProps}
					className='d-flex'
				>
					<i
						className={
							'd-flex align-items-center ' +
							'bi bi-grip-vertical text-bg-light ' +
							'border border-end-0 rounded-start-1 px-1'
						}
					/>
					<DroppableKeyboardButtons
						rowIndex={rowIndex}
						className='flex-fill border-top border-bottom py-1'
					/>
					<i
						className={
							'd-flex align-items-center ' +
							'bi bi-trash bg-light text-danger ' +
							'border border-start-0 rounded-end-1 px-1'
						}
						style={{ fontSize: 18, cursor: 'pointer' }}
						onClick={() => deleteRow(rowIndex)}
					/>
				</div>
			)}
		</Draggable>
	);
}

export default memo(DraggableKeyboardRow);
