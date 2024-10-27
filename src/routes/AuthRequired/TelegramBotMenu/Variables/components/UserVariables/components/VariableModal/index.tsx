import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import Modal from 'components/Modal';

import DescriptionInput from './components/DescriptionInput';
import NameInput from './components/NameInput';
import ValueEditor from './components/ValueEditor';
import StoreProvider from './providers/StoreProvider';

import useVariableModalStore from './hooks/useVariableModalStore';

function VariableModal(): ReactElement {
	const { t } = useTranslation('telegram-bot-menu-variables', {
		keyPrefix: 'user.variableModal',
	});

	const type = useVariableModalStore((state) => state.type);
	const show = useVariableModalStore((state) => state.show);
	const loading = useVariableModalStore((state) => state.loading);
	const hide = useVariableModalStore((state) => state.hide);
	const add = useVariableModalStore((state) => state.add);
	const save = useVariableModalStore((state) => state.save);

	return (
		<Modal show={show} loading={loading} onHide={hide}>
			<Modal.Header closeButton>
				<Modal.Title>{t('title', { context: type })}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='vstack gap-2'>
				<NameInput />
				<ValueEditor />
				<DescriptionInput />
			</Modal.Body>
			<Modal.Footer>
				<Button variant='success' onClick={type === 'add' ? add : save}>
					{t('actionButton', { context: type })}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default Object.assign(memo(VariableModal), { StoreProvider });
