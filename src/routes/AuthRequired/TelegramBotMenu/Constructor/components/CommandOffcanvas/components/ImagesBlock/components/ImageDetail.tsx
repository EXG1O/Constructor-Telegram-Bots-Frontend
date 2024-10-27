import React, { CSSProperties, HTMLAttributes, memo, ReactElement } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import Button from 'components/Button';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

import TrashIcon from 'assets/icons/trash.svg';

export interface ImageDetailProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	index: number;
}

const imageNameStyle: CSSProperties = { cursor: 'pointer' };

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
						size='sm'
						variant='danger'
						className='d-flex border-start-0 rounded-start-0 p-1'
						onClick={() =>
							updateImages((images) => {
								images.splice(index, 1);
							})
						}
					>
						<TrashIcon width={18} height={18} />
					</Button>
				</div>
			)}
		</Draggable>
	);
}

export default memo(ImageDetail);
