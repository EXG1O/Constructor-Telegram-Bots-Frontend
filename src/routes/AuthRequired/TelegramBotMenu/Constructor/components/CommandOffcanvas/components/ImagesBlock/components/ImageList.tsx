import React, { CSSProperties, HTMLAttributes, memo, ReactElement } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import classNames from 'classnames';
import { useField } from 'formik';
import { produce } from 'immer';

import { Images } from '..';

import ImageDetail from './ImageDetail';

export type ImageListProps = Pick<HTMLAttributes<HTMLDivElement>, 'className'>;

const blockStyle: CSSProperties = { maxHeight: 171 };

function ImageList({
	className,
	...props
}: ImageListProps): ReactElement<ImageListProps> | null {
	const [{ value: images }, _meta, { setValue }] = useField<Images>('images');

	function handleDragEnd(result: DropResult): void {
		if (!result.destination) return;

		setValue(
			produce(images, (draft) => {
				const [movedImage] = draft.splice(result.source.index, 1);
				draft.splice(result.destination!.index, 0, movedImage);
			}),
		);
	}

	return images.length ? (
		<div
			{...props}
			className={classNames(
				'bg-light overflow-auto border rounded-1 p-1',
				className,
			)}
			style={blockStyle}
		>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId='command-offcanvas-images'>
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className='row g-1'
						>
							{images.map((image, index) => (
								<ImageDetail key={image.key} index={index} />
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</div>
	) : null;
}

export default memo(ImageList);
