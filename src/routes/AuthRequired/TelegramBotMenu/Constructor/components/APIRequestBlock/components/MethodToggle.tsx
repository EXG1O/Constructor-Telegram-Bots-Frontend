import React, { ReactElement, memo } from 'react'

import ToggleButtonGroup, { ToggleButtonRadioProps } from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton, { ToggleButtonProps as _ToggleButtonProps } from 'react-bootstrap/ToggleButton';

export type Value = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface ToggleButtonProps extends Omit<_ToggleButtonProps, 'key' | 'id' | 'value' | 'size' | 'variant' | 'onChange' | 'children'> {
	value: Value;
}

const toggleButtons: ToggleButtonProps[] = [
	{ value: 'get' },
	{ value: 'post' },
	{ value: 'put' },
	{ value: 'patch' },
	{ value: 'delete' },
];

export type MethodToggleProps = Omit<ToggleButtonRadioProps<Value>, 'type' | 'name' | 'size' | 'vertical' | 'children'>;

function MethodToggle(props: MethodToggleProps): ReactElement<MethodToggleProps> {
	return (
		<ToggleButtonGroup
			{...props}
			type='radio'
			name='api-request-methods'
		>
			{toggleButtons.map((_props, index) => (
				<ToggleButton
					{..._props}
					key={index}
					id={`api-request-method-${_props.value}`}
					size='sm'
					variant='outline-dark'
				>
					{_props.value.toUpperCase()}
				</ToggleButton>
			))}
		</ToggleButtonGroup>
	);
}

export default memo(MethodToggle);