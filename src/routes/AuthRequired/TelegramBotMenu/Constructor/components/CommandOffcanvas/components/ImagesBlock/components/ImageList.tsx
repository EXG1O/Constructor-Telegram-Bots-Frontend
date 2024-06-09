import React, {
	ReactElement,
	HTMLAttributes,
	CSSProperties,
	memo,
	useMemo,
} from 'react';
import classNames from 'classnames';

import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import ImageDetail from './ImageDetail';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type ImageListProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function ImageList({
	className,
	style,
	...props
}: ImageListProps): ReactElement<ImageListProps> {
	const images = useCommandOffcanvasStore((state) => state.images);
	const updateImages = useCommandOffcanvasStore((state) => state.updateImages);

	const blockStyle = useMemo<CSSProperties>(
		() => ({ ...style, maxHeight: 171 }),
		[style],
	);

	function handleDragEnd(result: DropResult): void {
		if (!result.destination) return;

		updateImages((images) => {
			const [movedImage] = images.splice(result.source.index, 1);
			images.splice(result.destination!.index, 0, movedImage);
		});
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
	) : (
		<></>
	);
}

export default memo(ImageList);
