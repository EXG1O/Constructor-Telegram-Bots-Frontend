import React, { HTMLAttributes, memo, ReactElement } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';
import classNames from 'classnames';

import DraggableKeyboardRow from './DraggableKeyboardRow';

import useCommandOffcanvasStore from '../../../../../hooks/useCommandOffcanvasStore';

export type DroppableKeyboardRowsProps = Pick<
	DroppableProps,
	| 'isDropDisabled'
	| 'isCombineEnabled'
	| 'ignoreContainerClipping'
	| 'renderClone'
	| 'getContainerForClone'
> &
	Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function DroppableKeyboardRows({
	isDropDisabled,
	isCombineEnabled,
	ignoreContainerClipping,
	renderClone,
	getContainerForClone,
	className,
	...props
}: DroppableKeyboardRowsProps): ReactElement<DroppableKeyboardRowsProps> {
	const rows = useCommandOffcanvasStore((state) => state.keyboard.rows);

	return (
		<Droppable
			droppableId='all-rows'
			direction='vertical'
			type='ROW'
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
					className={classNames('row g-1', className)}
				>
					{rows.map((row, index) => (
						<DraggableKeyboardRow key={row.draggableId} rowIndex={index} />
					))}
					{placeholder}
				</div>
			)}
		</Droppable>
	);
}

export default memo(DroppableKeyboardRows);
