import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import useTelegramBotMenuRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRouteLoaderData';

import ToggleButton, { ToggleButtonProps } from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup, {
	ToggleButtonRadioProps,
} from 'react-bootstrap/ToggleButtonGroup';

import useUsersStore from '../../../hooks/useUsersStore';

import { Type } from '../../..';

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
	{ value: 'all' },
	{ value: 'allowed' },
	{ value: 'blocked' },
];

function TypeToggleButtonGroup(
	props: TypeToggleButtonGroupProps,
): ReactElement<TypeToggleButtonGroupProps> {
	const { t } = useTranslation('telegram-bot-menu-users', {
		keyPrefix: 'toolbar.typeButtonGroup',
	});

	const { telegramBot } = useTelegramBotMenuRouteLoaderData();

	const type = useUsersStore((state) => state.type);
	const updateUsers = useUsersStore((state) => state.updateUsers);

	return (
		<ToggleButtonGroup
			{...props}
			type='radio'
			name='user-types'
			value={type}
			className='bg-white'
			onChange={(type) => updateUsers(undefined, undefined, undefined, type)}
		>
			{typeToggleButtons.map(({ value, ...props }, index) =>
				!(value === 'allowed' && !telegramBot.is_private) ? (
					<ToggleButton
						{...props}
						key={index}
						id={`user-types-${value}`}
						value={value}
						size='sm'
						variant='outline-dark'
					>
						{t(value)}
					</ToggleButton>
				) : undefined,
			)}
		</ToggleButtonGroup>
	);
}

export default TypeToggleButtonGroup;
