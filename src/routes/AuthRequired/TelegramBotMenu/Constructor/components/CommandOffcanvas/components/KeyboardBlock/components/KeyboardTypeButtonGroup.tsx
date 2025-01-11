import React, { memo, ReactElement, useId, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import ToggleButtonGroup, {
	ToggleButtonProps,
	ToggleButtonRadioProps,
} from 'components/ToggleButtonGroup';

export type Type = 'default' | 'inline' | 'payment';

export type KeyboardTypeButtonGroupProps = Pick<
	ToggleButtonRadioProps<Type>,
	'className'
>;

interface TypeToggleButtonProps
	extends Pick<ToggleButtonProps, 'className' | 'children'> {
	value: Type;
}

export const defaultType: Type = 'default';

function KeyboardTypeButtonGroup(
	props: KeyboardTypeButtonGroupProps,
): ReactElement<KeyboardTypeButtonGroupProps> {
	const id = useId();

	const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.keyboardBlock.typeButtonGroup',
	});

	const [{ value }, _meta, { setValue }] = useField<Type>('keyboard.type');

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
			value={value}
			onChange={(value) => setValue(value)}
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
