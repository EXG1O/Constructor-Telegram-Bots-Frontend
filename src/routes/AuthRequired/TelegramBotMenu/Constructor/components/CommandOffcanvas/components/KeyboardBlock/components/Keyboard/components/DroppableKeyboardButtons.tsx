import React, { HTMLAttributes, memo, ReactElement } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';
import classNames from 'classnames';

import './DroppableKeyboardButtons.scss';

import DraggableKeyboardButton from './DraggableKeyboardButton';

import useCommandOffcanvasStore from '../../../../../hooks/useCommandOffcanvasStore';

export interface DroppableKeyboardButtonsProps
	extends Pick<
			DroppableProps,
			| 'isDropDisabled'
			| 'isCombineEnabled'
			| 'ignoreContainerClipping'
			| 'renderClone'
			| 'getContainerForClone'
		>,
		Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	rowIndex: number;
}

function DroppableKeyboardButtons({
	rowIndex,
	isDropDisabled,
	isCombineEnabled,
	ignoreContainerClipping,
	renderClone,
	getContainerForClone,
	className,
	...props
}: DroppableKeyboardButtonsProps): ReactElement<DroppableKeyboardButtonsProps> {
	const row = useCommandOffcanvasStore((state) => state.keyboard.rows[rowIndex]);

	return (
		<Droppable
			droppableId={row.draggableId}
			direction='horizontal'
			type='BUTTON'
			isDropDisabled={isDropDisabled}
			isCombineEnabled={isCombineEnabled}
			ignoreContainerClipping={ignoreContainerClipping}
			renderClone={renderClone}
			getContainerForClone={getContainerForClone}
		>
			{({ innerRef, droppableProps, placeholder }) => (
				<div
					ref={innerRef}
					{...props}
					{...droppableProps}
					className={classNames(
						'droppable-keyboard-buttons d-flex bg-light overflow-auto',
						className,
					)}
					style={{ minHeight: 41 }}
				>
					{row.buttons.map((button, index) => (
						<DraggableKeyboardButton
							key={button.draggableId}
							rowIndex={rowIndex}
							buttonIndex={index}
						/>
					))}
					{placeholder}
				</div>
			)}
		</Droppable>
	);
}

export default memo(DroppableKeyboardButtons);
