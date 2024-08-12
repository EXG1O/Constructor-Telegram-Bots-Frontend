import React, { ReactElement, useState } from 'react';

import Stack from 'react-bootstrap/Stack';

import Block from 'components/Block';

import TypeToggleButtonGroup from './components/TypeToggleButtonGroup';
import VariablesTable from './components/VariablesTable';

export type Type = 'personal' | 'global';

function SystemVariables(): ReactElement {
	const [type, setType] = useState<Type>('personal');

	return (
		<Block variant='light'>
			<h3 className='fw-semibold text-center mb-3'>
				{gettext('Системные переменные')}
			</h3>
			<Stack gap={2}>
				<TypeToggleButtonGroup
					value={type}
					className='col-lg-3'
					onChange={setType}
				/>
				<VariablesTable type={type} />
			</Stack>
		</Block>
	);
}

export default SystemVariables;
