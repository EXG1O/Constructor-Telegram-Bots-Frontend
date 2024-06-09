import React, { ReactElement, memo, useId } from 'react';

import ToggleButtonGroup, {
	ToggleButtonRadioProps,
} from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton, {
	ToggleButtonProps as BaseToggleButtonProps,
} from 'react-bootstrap/ToggleButton';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type Type = 'default' | 'inline' | 'payment';

export type KeyboardTypeButtonGroupProps = Omit<
	ToggleButtonRadioProps<Type>,
	'id' | 'type' | 'name' | 'value' | 'children' | 'onChange'
>;

interface ToggleButtonProps
	extends Omit<
		BaseToggleButtonProps,
		'key' | 'id' | 'size' | 'variant' | 'onChange'
	> {
	value: Type;
}

export const defaultType: Type = 'default';

const toggleButtons: ToggleButtonProps[] = [
	{ value: 'default', className: 'w-50', children: gettext('Обычный') },
	{ value: 'inline', className: 'w-50', children: gettext('Встроенный') },
	// { value: 'payment', children: gettext('Платёжный') },  # TODO: For future feature
];

function KeyboardTypeButtonGroup(
	props: KeyboardTypeButtonGroupProps,
): ReactElement<KeyboardTypeButtonGroupProps> {
	const id = useId();

	const type = useCommandOffcanvasStore((state) => state.keyboard.type);
	const updateKeyboard = useCommandOffcanvasStore((state) => state.updateKeyboard);

	return (
		<ToggleButtonGroup
			{...props}
			type='radio'
			name={id}
			value={type}
			onChange={(value) =>
				updateKeyboard((keyboard) => {
					keyboard.type = value;
				})
			}
		>
			{toggleButtons.map((props, index) => (
				<ToggleButton
					{...props}
					key={index}
					id={id + props.value}
					size='sm'
					variant='outline-dark'
				/>
			))}
		</ToggleButtonGroup>
	);
}

export default memo(KeyboardTypeButtonGroup);
