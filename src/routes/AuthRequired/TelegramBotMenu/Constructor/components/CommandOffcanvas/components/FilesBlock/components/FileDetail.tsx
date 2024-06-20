import React, { ReactElement, HTMLAttributes, CSSProperties, memo } from 'react';

import TrashIcon from 'assets/icons/trash.svg';

import { Draggable } from 'react-beautiful-dnd';

import Button from 'react-bootstrap/Button';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export interface FileDetailProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	index: number;
}

const fileNameStyle: CSSProperties = { cursor: 'pointer' };

function FileDetail({
	index,
	...props
}: FileDetailProps): ReactElement<FileDetailProps> {
	const file = useCommandOffcanvasStore((state) => state.files[index]);
	const updateFiles = useCommandOffcanvasStore((state) => state.updateFiles);

	return (
		<Draggable index={index} draggableId={`command-offcanvas-file-${file.key}`}>
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
						style={fileNameStyle}
					>
						{file.name}
					</small>
					<Button
						size='sm'
						variant='danger'
						className='d-flex border-start-0 rounded-start-0 p-1'
						onClick={() =>
							updateFiles((files) => {
								files.splice(index, 1);
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

export default memo(FileDetail);
