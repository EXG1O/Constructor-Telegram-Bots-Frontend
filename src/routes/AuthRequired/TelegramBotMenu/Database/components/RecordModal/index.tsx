import React, { memo, ReactElement } from 'react';

import Button from 'react-bootstrap/Button';

import Modal from 'components/Modal';

import DataEditor from './components/DataEditor';
import StoreProvider from './providers/StoreProvider';

import useRecordModalStore from './hooks/useRecordModalStore';

function RecordModal(): ReactElement {
	const type = useRecordModalStore((state) => state.type);
	const show = useRecordModalStore((state) => state.show);
	const loading = useRecordModalStore((state) => state.loading);
	const add = useRecordModalStore((state) => state.add);
	const hide = useRecordModalStore((state) => state.hide);

	return (
		<Modal show={show} loading={loading} onHide={hide}>
			<Modal.Header closeButton>
				<Modal.Title>
					{type === 'add' && gettext('Добавление записи')}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<DataEditor />
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant='success'
					{...(type === 'add' && {
						children: gettext('Добавить'),
						onClick: add,
					})}
				/>
			</Modal.Footer>
		</Modal>
	);
}

export default Object.assign(memo(RecordModal), { StoreProvider });
