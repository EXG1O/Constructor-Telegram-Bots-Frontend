import React, { ReactElement, useCallback } from 'react';

import Stack from 'react-bootstrap/Stack';

import Block from 'components/Block';

import Toolbar from './components/Toolbar';
import VariableModal from './components/VariableModal';
import VariablesTable from './components/VariablesTable';
import StoreProvider from './providers/StoreProvider';

import useUserVariablesStore from './hooks/useUserVariablesStore';

function UserVariables(): ReactElement {
	const updateVariables = useUserVariablesStore((state) => state.updateVariables);
	const handleAddOrSaveVariable = useCallback(() => updateVariables(), []);

	return (
		<VariableModal.StoreProvider
			onAdd={handleAddOrSaveVariable}
			onSave={handleAddOrSaveVariable}
		>
			<VariableModal />
			<Block variant='light'>
				<h3 className='fw-semibold text-center mb-3'>
					{gettext('Пользовательские переменные')}
				</h3>
				<Stack gap={2}>
					<Toolbar />
					<VariablesTable />
				</Stack>
			</Block>
		</VariableModal.StoreProvider>
	);
}

export default Object.assign(UserVariables, { StoreProvider });
