import React, { ReactElement } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import ToggleButton, { ToggleButtonProps } from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup, {
	ToggleButtonRadioProps,
} from 'react-bootstrap/ToggleButtonGroup';

import { LoaderData as TelegramBotMenuRootLoaderData } from '../../../../Root';

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
	{ value: 'all', children: gettext('Все') },
	{ value: 'allowed', children: gettext('Разрешённые') },
	{ value: 'blocked', children: gettext('Заблокированные') },
];

function TypeToggleButtonGroup(
	props: TypeToggleButtonGroupProps,
): ReactElement<TypeToggleButtonGroupProps> {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;

	const type = useUsersStore((state) => state.type);
	const updateUsers = useUsersStore((state) => state.updateUsers);

	return (
		<ToggleButtonGroup
			{...props}
			type='radio'
			name='user-types'
			value={type}
			onChange={(type) => updateUsers(undefined, undefined, undefined, type)}
		>
			{typeToggleButtons.map((props, index) =>
				!(props.value === 'allowed' && !telegramBot.is_private) ? (
					<ToggleButton
						{...props}
						key={index}
						id={`user-types-${props.value}`}
						size='sm'
						variant='outline-dark'
					/>
				) : undefined,
			)}
		</ToggleButtonGroup>
	);
}

export default TypeToggleButtonGroup;
