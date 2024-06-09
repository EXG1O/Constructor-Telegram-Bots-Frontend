import React, { ReactElement, HTMLAttributes, CSSProperties, memo } from 'react';

import { Draggable } from 'react-beautiful-dnd';

import Button from 'react-bootstrap/Button';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export interface ImageDetailProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	index: number;
}

const imageNameStyle: CSSProperties = { cursor: 'pointer' };
const deleteButtonStyle: CSSProperties = { fontSize: '18px', padding: '5px' };

function ImageDetail({
	index,
	...props
}: ImageDetailProps): ReactElement<ImageDetailProps> {
	const image = useCommandOffcanvasStore((state) => state.images[index]);
	const updateImages = useCommandOffcanvasStore((state) => state.updateImages);

	return (
		<Draggable index={index} draggableId={`command-offcanvas-image-${image.key}`}>
			{({ innerRef, draggableProps, dragHandleProps }) => (
				<div
					ref={innerRef}
					{...props}
					{...draggableProps}
					{...dragHandleProps}
					className='d-flex'
				>
					<small
						className='flex-fill text-bg-dark rounded-start-1 text-break px-2 py-1'
						style={imageNameStyle}
					>
						{image.name}
					</small>
					<Button
						as='i'
						size='sm'
						variant='danger'
						className={
							'd-flex justify-content-center align-items-center ' +
							'bi bi-trash border-start-0 rounded-start-0'
						}
						style={deleteButtonStyle}
						onClick={() =>
							updateImages((images) => {
								images.splice(index, 1);
							})
						}
					/>
				</div>
			)}
		</Draggable>
	);
}

export default memo(ImageDetail);
