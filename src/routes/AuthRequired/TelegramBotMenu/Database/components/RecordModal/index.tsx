import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button from 'components/Button';
import Modal from 'components/Modal';

import DataEditor from './components/DataEditor';
import StoreProvider from './providers/StoreProvider';

import useRecordModalStore from './hooks/useRecordModalStore';

function RecordModal(): ReactElement {
	const { t } = useTranslation(RouteID.TelegramBotMenuDatabase, {
		keyPrefix: 'records.recordModal',
	});

	const type = useRecordModalStore((state) => state.type);
	const show = useRecordModalStore((state) => state.show);
	const loading = useRecordModalStore((state) => state.loading);
	const add = useRecordModalStore((state) => state.add);
	const hide = useRecordModalStore((state) => state.hide);

	return (
		<Modal show={show} loading={loading} onHide={hide}>
			<Modal.Header closeButton>
				<Modal.Title>{t('title', { context: type })}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<DataEditor />
			</Modal.Body>
			<Modal.Footer>
				<Button variant='success' onClick={type === 'add' ? add : undefined}>
					{t('actionButton', { context: type })}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default Object.assign(memo(RecordModal), { StoreProvider });
