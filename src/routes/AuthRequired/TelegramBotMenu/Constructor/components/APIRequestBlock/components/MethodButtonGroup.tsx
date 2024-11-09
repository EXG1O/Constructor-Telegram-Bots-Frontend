import React, { memo, ReactElement, useId } from 'react';

import ToggleButtonGroup, {
	ToggleButtonProps,
	ToggleButtonRadioProps,
} from 'components/ToggleButtonGroup';

import useAPIRequestBlockStore from '../hooks/useAPIRequestBlockStore';

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type MethodButtonGroupProps = Omit<
	ToggleButtonRadioProps<Method>,
	'size' | 'type' | 'name' | 'value' | 'children' | 'onChange'
>;

interface MethodToggleButtonProps
	extends Omit<
		ToggleButtonProps,
		'key' | 'id' | 'value' | 'size' | 'variant' | 'children' | 'onChange'
	> {
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
			{methodToggleButtons.map((props, index) => (
				<ToggleButtonGroup.Button
					{...props}
					key={index}
					id={id + props.value}
					variant='outline-dark'
				>
					{props.value.toUpperCase()}
				</ToggleButtonGroup.Button>
			))}
		</ToggleButtonGroup>
	);
}

export default memo(MethodButtonGroup);
