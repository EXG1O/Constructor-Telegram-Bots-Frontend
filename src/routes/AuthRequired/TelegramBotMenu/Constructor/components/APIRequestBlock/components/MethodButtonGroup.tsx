import React, { ReactElement, memo, useId } from 'react';

import ToggleButtonGroup, {
	ToggleButtonRadioProps,
} from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton, {
	ToggleButtonProps as BaseToggleButtonProps,
} from 'react-bootstrap/ToggleButton';

import useAPIRequestBlockStore from '../hooks/useAPIRequestBlockStore';

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type MethodButtonGroupProps = Omit<
	ToggleButtonRadioProps<Method>,
	'size' | 'type' | 'name' | 'value' | 'children' | 'onChange'
>;

interface ToggleButtonProps
	extends Omit<
		BaseToggleButtonProps,
		'key' | 'id' | 'value' | 'size' | 'variant' | 'children' | 'onChange'
	> {
	value: Method;
}

export const defaultMethod: Method = 'get';

const toggleButtons: ToggleButtonProps[] = [
	{ value: 'get' },
	{ value: 'post' },
	{ value: 'put' },
	{ value: 'patch' },
	{ value: 'delete' },
];

function MethodButtonGroup(
	props: MethodButtonGroupProps,
): ReactElement<MethodButtonGroupProps> {
	const id = useId();

	const method = useAPIRequestBlockStore((state) => state.apiRequest.method);
	const updateAPIRequest = useAPIRequestBlockStore((state) => state.updateAPIRequest);

	return (
		<ToggleButtonGroup
			{...props}
			size='sm'
			type='radio'
			name={id}
			value={method}
			onChange={(method) =>
				updateAPIRequest((apiRequest) => {
					apiRequest.method = method;
				})
			}
		>
			{toggleButtons.map((props, index) => (
				<ToggleButton
					{...props}
					key={index}
					id={id + props.value}
					variant='outline-dark'
				>
					{props.value.toUpperCase()}
				</ToggleButton>
			))}
		</ToggleButtonGroup>
	);
}

export default memo(MethodButtonGroup);
