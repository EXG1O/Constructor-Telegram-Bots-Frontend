import React, { ReactElement } from 'react';

import { useRouteLoaderData } from 'react-router-dom';

import ToggleButton, { ToggleButtonProps } from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup, {
	ToggleButtonRadioProps,
} from 'react-bootstrap/ToggleButtonGroup';

import { Type } from '../../..';

import { LoaderData as TelegramBotMenuRootLoaderData } from '../../../../Root';
import useUsers from '../../../hooks/useUsers';

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

	const { updateUsers, filter } = useUsers();

	return (
		<ToggleButtonGroup
			{...props}
			type='radio'
			name='user-types'
			value={filter.type}
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
