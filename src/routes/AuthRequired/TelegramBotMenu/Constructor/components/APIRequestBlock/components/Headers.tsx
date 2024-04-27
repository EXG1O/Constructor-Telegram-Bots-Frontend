import React, { ReactElement, memo } from 'react'

import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

export interface HeaderData {
	key: string;
	value: string;
}

export type Data = HeaderData[];

export interface HeadersProps {
	show: boolean;
	data?: Data;
	onShow: () => void;
	onHide: () => void;
	onChange: (data?: Data) => void;
}

function Headers({ show, data, onShow, onHide, onChange }: HeadersProps): ReactElement<HeadersProps> {
	function handleHeaderChange<T extends keyof HeaderData>(index: number, name: T, value: HeaderData[T]): void {
		if (data) {
			const headers = [...data];

			headers[index][name] = value;

			onChange(headers);
		}
	}

	function handleDeleteHeaderButtonClick(index: number): void {
		if (data) {
			const headers = [...data];

			headers.splice(index, 1);

			onChange(headers);
		}
	}

	return (
		<div>
			<Button
				size='sm'
				{...(
					show ? {
						variant: 'secondary',
						className: 'w-100 border-bottom-0 rounded-bottom-0',
						children: gettext('Убрать заголовки'),
					} : {
						variant: 'dark',
						className: 'w-100',
						children: gettext('Добавить заголовки'),
					}
				)}
				aria-controls='command-offcanvas-api-request-headers-addon'
				aria-expanded={show}
				onClick={show ? onHide : onShow}
			/>
			<Collapse
				in={show}
				unmountOnExit
				onEnter={() => onChange([])}
				onExited={() => onChange(undefined)}
			>
				<div id='command-offcanvas-api-request-headers-addon'>
					<div className='vstack border border-top-0 rounded-1 rounded-top-0 gap-1 p-1'>
						{data?.map((header, index) => (
							<InputGroup key={index}>
								<Form.Control
									size='sm'
									value={header.key}
									placeholder={gettext('Ключ')}
									onChange={e => handleHeaderChange(index, 'key', e.target.value)}
								/>
								<Form.Control
									size='sm'
									value={header.value}
									placeholder={gettext('Значение')}
									onChange={e => handleHeaderChange(index, 'value', e.target.value)}
								/>
								<Button
									as='i'
									size='sm'
									variant='danger'
									className='bi bi-trash d-flex justify-content-center align-items-center p-0'
									style={{ width: '31px', height: '31px', fontSize: '18px' }}
									onClick={() => handleDeleteHeaderButtonClick(index)}
								/>
							</InputGroup>
						))}
						<Button
							size='sm'
							variant='dark'
							onClick={() => onChange([...data!, { key: '', value: '' }])}
						>
							{gettext('Добавить заголовок')}
						</Button>
					</div>
				</div>
			</Collapse>
		</div>
	);
}

export default memo(Headers);