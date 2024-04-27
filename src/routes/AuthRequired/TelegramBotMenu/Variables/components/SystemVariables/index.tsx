import React, { ReactElement, useState } from 'react';

import Card from 'react-bootstrap/Card';

import TypeToggleButtonGroup from './components/TypeToggleButtonGroup';
import VariableList from './components/VariableList';

export type Type = 'personal' | 'global';

function SystemVariables(): ReactElement {
	const [type, setType] = useState<Type>('personal');

	return (
		<Card>
			<Card.Header as='h5' className='text-center'>
				{gettext('Системные переменные')}
			</Card.Header>
			<Card.Body className='vstack gap-2'>
				<TypeToggleButtonGroup
					value={type}
					className='col-lg-3'
					onChange={setType}
				/>
				<VariableList type={type} />
			</Card.Body>
		</Card>
	);
}

export default SystemVariables;