import React, { ReactElement, ChangeEvent as ReactChangeEvent, memo } from 'react';

import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import Block, { BlockProps } from '../../Block';

import useToast from 'services/hooks/useToast';

interface FileData extends Pick<File, 'name' | 'size'> {
	id?: number;
	key: string;
	file?: File;
}

export type Data = FileData[];

export interface FilesBlockProps extends Omit<BlockProps, 'title' | 'onChange' | 'children'> {
	data?: Data;
	remainingStorageSize: number;
	onChange: (data: Data) => void;
}

export const defaultData: Data = [];

function FilesBlock({ data = defaultData, remainingStorageSize, onChange, ...props }: FilesBlockProps): ReactElement<FilesBlockProps> {
	const { createMessageToast } = useToast();

	function handleFilesChange(event: ReactChangeEvent<HTMLInputElement>): void {
		if (event.target.files) {
			const files: File[] = Object.values(event.target.files);
			let availableStorageSize: number = remainingStorageSize;

			event.target.value = '';

			onChange([
				...data,
				...files.filter(file => {
					if (file.size > 2621440) {
						createMessageToast({
							message: interpolate(
								gettext('Файл %(name)s весит больше 2.5MB!'),
								{ name: file.name },
								true,
							),
							level: 'error',
						});
						return false;
					}

					if (availableStorageSize - file.size < 0) {
						createMessageToast({
							message: interpolate(
								gettext('Невозможно добавить файл %(name)s, потому-что не хватает места в хранилище!'),
								{ name: file.name },
								true,
							),
							level: 'error',
						});
						return false;
					}

					availableStorageSize -= file.size;

					return true;
				}).map(file => ({
					key: crypto.randomUUID(),
					file,
					name: file.name,
					size: file.size,
				})),
			]);
		}
	}

	function handleFileDragEnd(result: DropResult): void {
		if (result.destination) {
			const files = [...data];

			const [movedFile] = files.splice(result.source.index, 1);
			files.splice(result.destination.index, 0, movedFile);

			onChange(files);
		}
	}

	function handleDeleteFileButtonClick(index: number): void {
		const files = [...data];

		files.splice(index, 1);

		onChange(files);
	}

	return (
		<Block {...props} title={gettext('Файлы')}>
			<Block.Body className='vstack gap-2'>
				{Boolean(data.length) && (
					<div className='d-flex flex-wrap border rounded-1 gap-1 p-1'>
						<DragDropContext onDragEnd={handleFileDragEnd}>
							<Droppable droppableId='command-offcanvas-files'>
								{provided => (
									<div
										ref={provided.innerRef}
										{...provided.droppableProps}
										className='row row-cols-auto g-1'
									>
										{data.map((file, index) => (
											<Draggable
												key={file.key}
												index={index}
												draggableId={`command-offcanvas-file-${file.key}`}
											>
												{provided => (
													<ButtonGroup
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													>
														<small
															className='text-bg-dark rounded-1 rounded-end-0 px-2 py-1'
															style={{ cursor: 'pointer' }}
														>
															{file.name}
														</small>
														<Button
															as='i'
															size='sm'
															variant='danger'
															className='bi bi-trash d-flex justify-content-center align-items-center p-0'
															style={{ width: '29px', fontSize: '18px' }}
															onClick={() => handleDeleteFileButtonClick(index)}
														/>
													</ButtonGroup>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext>
					</div>
				)}
				<input
					id='command-offcanvas-files-input-file'
					type='file'
					multiple
					hidden
					onChange={handleFilesChange}
				/>
				<Button
					as='label'
					htmlFor='command-offcanvas-files-input-file'
					size='sm'
					variant='dark'
				>
					{gettext('Добавить файл')}
				</Button>
			</Block.Body>
		</Block>
	);
}

export default memo(FilesBlock);