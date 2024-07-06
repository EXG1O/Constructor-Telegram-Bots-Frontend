import React, { HTMLAttributes, memo, ReactElement } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import classNames from 'classnames';

import FileDetail from './FileDetail';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type FileListProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function FileList({ className, ...props }: FileListProps): ReactElement<FileListProps> {
	const files = useCommandOffcanvasStore((state) => state.files);
	const updateFiles = useCommandOffcanvasStore((state) => state.updateFiles);

	function handleDragEnd(result: DropResult): void {
		if (!result.destination) return;

		updateFiles((files) => {
			const [movedFile] = files.splice(result.source.index, 1);
			files.splice(result.destination!.index, 0, movedFile);
		});
	}

	return files.length ? (
		<div
			{...props}
			className={classNames('bg-light border rounded-1 gap-1 p-1', className)}
		>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId='command-offcanvas-files'>
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className='row g-1'
						>
							{files.map((file, index) => (
								<FileDetail key={file.key} index={index} />
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

export default memo(FileList);
