import React, { memo, ReactElement } from 'react';
import { Draggable, DraggableProps } from 'react-beautiful-dnd';

import { KeyboardButton } from './DraggableKeyboardButton';
import DroppableKeyboardButtons from './DroppableKeyboardButtons';

import useCommandOffcanvasStore from '../../../../../hooks/useCommandOffcanvasStore';

import GripVerticalIcon from 'assets/icons/grip-vertical.svg';
import TrashIcon from 'assets/icons/trash.svg';

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
					<div className='d-flex align-items-center text-bg-light border border-end-0 rounded-start-1 px-1'>
						<GripVerticalIcon />
					</div>
					<DroppableKeyboardButtons
						rowIndex={rowIndex}
						className='flex-fill border-top border-bottom py-1'
					/>
					<div
						className='d-flex align-items-center bg-light text-danger border border-start-0 rounded-end-1 px-1'
						style={{ cursor: 'pointer' }}
						onClick={() => deleteRow(rowIndex)}
					>
						<TrashIcon width={18} height={18} />
					</div>
				</div>
			)}
		</Draggable>
	);
}

export default memo(DraggableKeyboardRow);
