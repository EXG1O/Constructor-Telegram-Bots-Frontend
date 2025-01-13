import React, { memo, useId } from 'react';
import { useField } from 'formik';

import ToggleButtonGroup from 'components/ToggleButtonGroup';

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface MethodToggleButtonProps {
	value: Method;
}

export const defaultMethod: Method = 'get';

const methodToggleButtons: MethodToggleButtonProps[] = [
	{ value: 'get' },
	{ value: 'post' },
	{ value: 'put' },
	{ value: 'patch' },
	{ value: 'delete' },
];

function MethodButtonGroup() {
	const id = useId();

	const [{ value }, _meta, { setValue }] = useField<Method>('api_request.method');

	return (
		<ToggleButtonGroup
			size='sm'
			type='radio'
			name={id}
			value={value}
			onChange={setValue}
		>
			{methodToggleButtons.map(({ value }, index) => (
				<ToggleButtonGroup.Button
					key={index}
					id={id + index}
					value={value}
					variant='outline-dark'
				>
					{value.toUpperCase()}
				</ToggleButtonGroup.Button>
			))}
		</ToggleButtonGroup>
	);
}

export default memo(MethodButtonGroup);
