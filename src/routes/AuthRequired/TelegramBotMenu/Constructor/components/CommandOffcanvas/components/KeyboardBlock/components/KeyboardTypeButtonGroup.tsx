import React, { memo, ReactElement, useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ToggleButton, {
	ToggleButtonProps as BaseToggleButtonProps,
} from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup, {
	ToggleButtonRadioProps,
} from 'react-bootstrap/ToggleButtonGroup';

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

function KeyboardTypeButtonGroup(
	props: KeyboardTypeButtonGroupProps,
): ReactElement<KeyboardTypeButtonGroupProps> {
	const id = useId();

	const { t, i18n } = useTranslation('telegram-bot-menu-constructor', {
		keyPrefix: 'commandOffcanvas.keyboardBlock.typeButtonGroup',
	});

	const type = useCommandOffcanvasStore((state) => state.keyboard.type);
	const updateKeyboard = useCommandOffcanvasStore((state) => state.updateKeyboard);

	const toggleButtons = useMemo<ToggleButtonProps[]>(
		() => [
			{ value: 'default', className: 'w-50', children: t('default') },
			{ value: 'inline', className: 'w-50', children: t('inline') },
			// { value: 'payment', children: t('payment') },  # TODO: For future feature
		],
		[i18n.language],
	);

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
