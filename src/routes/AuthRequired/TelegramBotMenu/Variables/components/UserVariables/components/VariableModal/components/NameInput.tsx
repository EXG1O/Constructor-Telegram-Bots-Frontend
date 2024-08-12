import React, { memo, ReactElement } from 'react';

import Input from 'react-bootstrap/FormControl';

import useVariableModalStore from '../hooks/useVariableModalStore';

export type Name = string;

export const defaultName: Name = '';

function NameInput(): ReactElement {
	const name = useVariableModalStore((state) => state.name);
	const setName = useVariableModalStore((state) => state.setName);

	return (
		<Input
			value={name}
			placeholder={gettext('Придумайте название')}
			onChange={(e) => setName(e.target.value)}
		/>
	);
}

export default memo(NameInput);
