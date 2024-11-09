import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { Type } from '..';

import ToggleButtonGroup, {
	ToggleButtonProps,
	ToggleButtonRadioProps,
} from 'components/ToggleButtonGroup';

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
	{ value: 'personal' },
	{ value: 'global' },
];

function TypeToggleButtonGroup({
	className,
	...props
}: TypeToggleButtonGroupProps): ReactElement<TypeToggleButtonGroupProps> {
	const { t } = useTranslation('telegram-bot-menu-variables', {
		keyPrefix: 'system.typeButtonGroup',
	});

	return (
		<ToggleButtonGroup
			{...props}
			type='radio'
			name='system-variables-types'
			className={classNames('bg-white', className)}
		>
			{typeToggleButtons.map(({ value, ...props }, index) => (
				<ToggleButtonGroup.Button
					{...props}
					key={index}
					id={`system-variables-${value}`}
					value={value}
					size='sm'
					variant='outline-dark'
				>
					{t(value)}
				</ToggleButtonGroup.Button>
			))}
		</ToggleButtonGroup>
	);
}

export default TypeToggleButtonGroup;
