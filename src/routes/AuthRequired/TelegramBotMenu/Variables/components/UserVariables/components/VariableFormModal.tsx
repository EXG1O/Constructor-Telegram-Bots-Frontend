import React, { ReactElement, ReactNode } from 'react';

import Form from 'react-bootstrap/Form';

import Modal, { ModalProps } from 'components/Modal';
import TelegramQuillEditor from 'components/TelegramQuillEditor';

export interface Data {
	name: string;
	value: string;
	description: string;
}

export interface VariableFormModalProps extends Omit<ModalProps, 'children'> {
	data: Data;
	title: string;
	onChange: (data: Data) => void;
	onHide: NonNullable<ModalProps['onHide']>;
	children?: ReactNode;
}

export const defaultData: Data = {
	name: '',
	value: '',
	description: '',
}

function VariableFormModal({ data, title, children, onChange, ...props }: VariableFormModalProps): ReactElement<VariableFormModalProps> {
	return (
		<Modal {...props}>
			<Modal.Header closeButton>
				<Modal.Title as='h5'>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='vstack gap-2'>
				<Form.Control
					value={data.name}
					placeholder={gettext('Придумайте название')}
					onChange={e => onChange({ ...data, name: e.target.value })}
				/>
				<TelegramQuillEditor
					height={220}
					value={data.value}
					placeholder={gettext('Введите значение')}
					onChange={value => onChange({ ...data, value })}
				/>
				<Form.Control
					value={data.description}
					placeholder={gettext('Введите описание')}
					onChange={e => onChange({ ...data, description: e.target.value })}
				/>
			</Modal.Body>
			{children}
		</Modal>
	);
}

export default Object.assign(VariableFormModal, { Footer: Modal.Footer });