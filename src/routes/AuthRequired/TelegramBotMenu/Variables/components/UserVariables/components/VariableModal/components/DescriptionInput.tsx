import React, { memo, ReactElement } from 'react';

import Input from 'react-bootstrap/FormControl';

import useVariableModalStore from '../hooks/useVariableModalStore';

export type Description = string;

export const defaultDescription: Description = '';

function DescriptionInput(): ReactElement {
	const description = useVariableModalStore((state) => state.description);
	const setDescription = useVariableModalStore((state) => state.setDescription);

	return (
		<Input
			value={description}
			placeholder={gettext('Введите описание')}
			onChange={(e) => setDescription(e.target.value)}
		/>
	);
}

export default memo(DescriptionInput);
