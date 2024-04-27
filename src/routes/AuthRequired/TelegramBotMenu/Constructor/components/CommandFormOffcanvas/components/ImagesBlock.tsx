import React, { ReactElement, ChangeEvent as ReactChangeEvent, memo, useState } from 'react';

import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Carousel from 'react-bootstrap/Carousel';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import Loading from 'components/Loading';

import Block, { BlockProps } from '../../Block';

import useToast from 'services/hooks/useToast';

interface ImageData extends Pick<File, 'name' | 'size'> {
	id?: number;
	key: string;
	file?: File;
	url: string;
}

export type Data = ImageData[];

export interface ImagesBlockProps extends Omit<BlockProps, 'title' | 'onChange' | 'children'> {
	data?: Data;
	remainingStorageSize: number;
	onChange: (data: Data) => void;
}

export const defaultData: Data = [];

interface ProcessedFile extends File {
	url?: string;
}

function ImagesBlock({ data = defaultData, remainingStorageSize, onChange, ...props }: ImagesBlockProps): ReactElement<ImagesBlockProps> {
	const { createMessageToast } = useToast();

	const [loading, setLoading] = useState<boolean>(false);

	function handleImagesChange(event: ReactChangeEvent<HTMLInputElement>): void {
		if (event.target.files) {
			setLoading(true);

			const files: File[] = Object.values(event.target.files);
			let availableStorageSize: number = remainingStorageSize;

			event.target.value = '';

			const processedFiles: ProcessedFile[] = files.filter(file => {
				if (file.size > 2621440) {
					createMessageToast({
						message: interpolate(
							gettext('Изображение %(name)s весит больше 2.5МБ!'),
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
							gettext('Невозможно добавить изображение %(name)s, потому-что не хватает места в хранилище!'),
							{ name: file.name },
							true,
						),
						level: 'error',
					});
					return false;
				}

				availableStorageSize -= file.size;

				return true;
			}).map((file, index) => {
				const fileRender = new FileReader();
				fileRender.readAsDataURL(file);
				fileRender.addEventListener('loadend', e => {
					if (e.target?.result) {
						processedFiles[index].url = e.target.result as string;
					} else {
						delete processedFiles[index];
					}
				});

				return file;
			});

			const checkFilesResult = (): void => {
				for (const file of processedFiles) {
					if (!file.url) {
						setTimeout(checkFilesResult, 500);
						return;
					}
				}

				onChange([
					...data,
					...processedFiles.map(file => ({
						key: crypto.randomUUID(),
						file: file,
						name: file.name,
						size: file.size,
						url: file.url!,
					})),
				]);
				setLoading(false);
			}

			checkFilesResult();
		}
	}

	function handleImageDragEnd(result: DropResult): void {
		if (result.destination) {
			const images = [...data];

			const [movedImage] = images.splice(result.source.index, 1);
			images.splice(result.destination.index, 0, movedImage);

			onChange(images);
		}
	}

	function handleDeleteImageButtonClick(index: number): void {
		const images = [...data];

		images.splice(index, 1);

		onChange(images);
	}

	return (
		<Block {...props} title={gettext('Изображение')}>
			<Block.Body className='vstack gap-2'>
				{!loading ? (
					Boolean(data.length) && (
						<>
							<Carousel
								variant='dark'
								interval={null}
								controls={data.length > 1}
								indicators={data.length > 1}
								className='overflow-hidden border rounded'
							>
								{data.map(image => (
									<Carousel.Item key={image.key}>
										<img
											src={image.url}
											className='w-100'
											style={{
												height: '200px',
												objectFit: 'contain',
											}}
										/>
									</Carousel.Item>
								))}
							</Carousel>
							<div className='border rounded-1 p-1'>
								<DragDropContext onDragEnd={handleImageDragEnd}>
									<Droppable droppableId='command-offcanvas-images'>
										{provided => (
											<div
												ref={provided.innerRef}
												{...provided.droppableProps}
												className='row row-cols-auto g-1'
											>
												{data.map((image, index) => (
													<Draggable
														key={image.key}
														index={index}
														draggableId={`command-offcanvas-image-${image.key}`}
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
																	{image.name}
																</small>
																<Button
																	as='i'
																	size='sm'
																	variant='danger'
																	className='bi bi-trash d-flex justify-content-center align-items-center p-0'
																	style={{ width: '29px', fontSize: '18px' }}
																	onClick={() => handleDeleteImageButtonClick(index)}
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
						</>
					)
				) : (
					<div className='d-flex justify-content-center border rounded' style={{ height: '202px' }}>
						<Loading size='md' className='align-self-center' />
					</div>
				)}
				<input
					id='command-offcanvas-images-input-file'
					type='file'
					accept='image/*'
					multiple
					hidden
					onChange={handleImagesChange}
				/>
				<Button
					as='label'
					htmlFor='command-offcanvas-images-input-file'
					size='sm'
					variant='dark'
				>
					{gettext('Добавить изображение')}
				</Button>
			</Block.Body>
		</Block>
	);
}

export default memo(ImagesBlock);