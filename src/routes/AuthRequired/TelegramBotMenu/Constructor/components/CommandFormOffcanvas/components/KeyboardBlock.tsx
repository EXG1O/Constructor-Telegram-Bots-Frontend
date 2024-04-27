import React, { ReactElement, memo } from 'react';

import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton, { ToggleButtonProps } from 'react-bootstrap/ToggleButton';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Block, { BlockProps } from '../../Block';

export interface ButtonData {
	id?: number;
	row?: number;
	text: string;
	url?: string;
}

export interface Data {
	type: 'default' | 'inline' | 'payment';
	buttons: ButtonData[];
}

export interface KeyboardBlockProps extends Omit<BlockProps, 'title' | 'onChange' | 'children'> {
	data?: Data;
	onChange: (data: Data) => void;
}

export const defaultData: Data = { type: 'default', buttons: [] };

interface KeyboardToggleButtonProps extends Omit<ToggleButtonProps, 'key' | 'id' | 'value' | 'size' | 'variant' | 'onChange'> {
	value: Data['type'];
}

const keyboardToggleButtons: KeyboardToggleButtonProps[] = [
	{ value: 'default', children: gettext('Обычный') },
	{ value: 'inline', children: gettext('Встроенный') },
	{ value: 'payment', children: gettext('Платёжный') },
];

function KeyboardBlock({ data = defaultData, onChange, ...props }: KeyboardBlockProps): ReactElement<KeyboardBlockProps> {
	function handleButtonChange(index: number, buttonData: Partial<ButtonData>): void {
		const buttons = [...data.buttons];

		let [button] = buttons.splice(index, 1);
		button = { ...button, ...buttonData };

		buttons.splice(index, 0, button);

		onChange({ ...data, buttons });
	}

	function handleButtonDelete(index: number): void {
		const buttons = [...data.buttons];

		buttons.splice(index, 1);

		onChange({ ...data, buttons });
	}

	function handleButtonDragEnd(result: DropResult): void {
		if (result.destination) {
			const buttons = [...data.buttons];

			const [movedButton] = buttons.splice(result.source.index, 1);
			buttons.splice(result.destination.index, 0, movedButton);

			onChange({ ...data, buttons });
		}
	}

	return (
		<Block {...props} title={gettext('Клавиатура')}>
			<Block.Body className='vstack gap-2'>
				<ToggleButtonGroup type='radio' name='keyboard-types' defaultValue='default'>
					{keyboardToggleButtons.map((props, index) => (
						<ToggleButton
							{...props}
							key={index}
							id={`keyboard-type-${props.value}`}
							size='sm'
							variant='outline-dark'
							onChange={() => onChange({ ...data, type: props.value })}
						/>
					))}
				</ToggleButtonGroup>
				<div>
					<DragDropContext onDragEnd={handleButtonDragEnd}>
						<Droppable droppableId='keyboard-buttons'>
							{provided => (
								<>
									<div ref={provided.innerRef} {...provided.droppableProps}>
										{data.buttons.map((button, index) => (
											<Draggable
												key={index}
												index={index}
												draggableId={`keyboard-button-${index}`}
											>
												{provided => (
													<InputGroup
														ref={provided.innerRef}
														className='mb-1'
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													>
														<Button
															as='div'
															size='sm'
															variant='light'
															className='border bi bi-grip-vertical d-flex justify-content-center align-items-center p-0'
															style={{ width: '31px', height: '31px', cursor: 'grab', fontSize: '18px' }}
														/>
														<Form.Control
															value={button.text}
															size='sm'
															className='text-center'
															placeholder={gettext('Название кнопки')}
															onChange={e => handleButtonChange(index, { text: e.target.value })}
														/>
														{(data.type === 'inline' || data.type === 'payment') && (
															button.url !== undefined ? (
																<Form.Control
																	value={button.url ?? undefined}
																	size='sm'
																	className='text-center'
																	placeholder='URL-адрес'
																	onChange={e => handleButtonChange(index, { url: e.target.value })}
																/>
															) : (
																<Button
																	as='i'
																	size='sm'
																	variant='secondary'
																	className='bi bi-link-45deg d-flex justify-content-center align-items-center p-0'
																	style={{ width: '31px', height: '31px', fontSize: '18px' }}
																	onClick={() => handleButtonChange(index, { url: '' })}
																/>
															)
														)}
														<Button
															as='i'
															size='sm'
															variant='danger'
															className='bi bi-trash d-flex justify-content-center align-items-center p-0'
															style={{ width: '31px', height: '31px', fontSize: '18px' }}
															onClick={() => handleButtonDelete(index)}
														/>
													</InputGroup>
												)}
											</Draggable>
										))}
									</div>
									{provided.placeholder}
								</>
							)}
						</Droppable>
					</DragDropContext>
					<Button
						size='sm'
						variant='dark'
						className='w-100'
						onClick={() => onChange({ ...data, buttons: [...data.buttons, { text: '' }] })}
					>
						{gettext('Добавить кнопку')}
					</Button>
				</div>
			</Block.Body>
		</Block>
	);
}

export default memo(KeyboardBlock);