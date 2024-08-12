import React, { ReactElement } from 'react';

import Button from 'react-bootstrap/Button';

import Modal from 'components/Modal';

import DescriptionInput from './components/DescriptionInput';
import NameInput from './components/NameInput';
import ValueEditor from './components/ValueEditor';
import StoreProvider from './providers/StoreProvider';

import useVariableModalStore from './hooks/useVariableModalStore';

function VariableModal(): ReactElement {
	const type = useVariableModalStore((state) => state.type);
	const show = useVariableModalStore((state) => state.show);
	const loading = useVariableModalStore((state) => state.loading);
	const hide = useVariableModalStore((state) => state.hide);
	const add = useVariableModalStore((state) => state.add);
	const save = useVariableModalStore((state) => state.save);

	return (
		<Modal show={show} loading={loading} onHide={hide}>
			<Modal.Header closeButton>
				<Modal.Title>
					{type === 'add'
						? gettext('Добавление переменной')
						: gettext('Редактирование переменной')}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className='vstack gap-2'>
				<NameInput />
				<ValueEditor />
				<DescriptionInput />
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant='success'
					{...(type === 'add'
						? {
								children: gettext('Добавить'),
								onClick: add,
							}
						: {
								children: gettext('Сохранить'),
								onClick: save,
							})}
				/>
			</Modal.Footer>
		</Modal>
	);
}

export default Object.assign(VariableModal, { StoreProvider });
