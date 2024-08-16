import React, { ReactElement } from 'react';
import classNames from 'classnames';

import { Type } from '..';

import ToggleButton, { ToggleButtonProps } from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup, {
	ToggleButtonRadioProps,
} from 'react-bootstrap/ToggleButtonGroup';

export type TypeToggleButtonGroupProps = Omit<
	ToggleButtonRadioProps<Type>,
	'type' | 'name' | 'children'
>;

interface TypeToggleButtonProps
	extends Omit<
		ToggleButtonProps,
		'key' | 'id' | 'value' | 'size' | 'variant' | 'onChange'
	> {
	value: Type;
}

const typeToggleButtons: TypeToggleButtonProps[] = [
	{ value: 'personal', children: gettext('Персональные') },
	{ value: 'global', children: gettext('Глобальные') },
];

function TypeToggleButtonGroup({
	className,
	...props
}: TypeToggleButtonGroupProps): ReactElement<TypeToggleButtonGroupProps> {
	return (
		<ToggleButtonGroup
			{...props}
			type='radio'
			name='system-variables-types'
			className={classNames('bg-white', className)}
		>
			{typeToggleButtons.map((props, index) => (
				<ToggleButton
					{...props}
					key={index}
					id={`system-variables-${props.value}`}
					size='sm'
					variant='outline-dark'
				/>
			))}
		</ToggleButtonGroup>
	);
}

export default TypeToggleButtonGroup;
