import React, { memo, ReactElement, useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ToggleButtonGroup, {
	ToggleButtonProps,
	ToggleButtonRadioProps,
} from 'components/ToggleButtonGroup';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type Type = 'default' | 'inline' | 'payment';

export type KeyboardTypeButtonGroupProps = Omit<
	ToggleButtonRadioProps<Type>,
	'id' | 'type' | 'name' | 'value' | 'children' | 'onChange'
>;

interface TypeToggleButtonProps
	extends Omit<ToggleButtonProps, 'key' | 'id' | 'size' | 'variant' | 'onChange'> {
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

	const toggleButtons = useMemo<TypeToggleButtonProps[]>(
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
				<ToggleButtonGroup.Button
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
