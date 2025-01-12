import React, { CSSProperties, memo, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { reverse, RouteID } from 'routes';

import Dropdown, { DropdownProps } from 'components/Dropdown';

import { TelegramBot } from 'api/telegram_bots/types';

export interface TelegramBotMenuDropdownProps extends Omit<DropdownProps, 'children'> {
	telegramBot: TelegramBot;
}

const toggleButtonStyle: CSSProperties = { maxWidth: '150px' };

function TelegramBotMenuDropdown({
	telegramBot,
	...props
}: TelegramBotMenuDropdownProps): ReactElement<TelegramBotMenuDropdownProps> {
	const { t, i18n } = useTranslation(RouteID.Root, {
		keyPrefix: 'telegramBotMenuDropdown',
	});

	const params = useMemo(() => ({ telegramBotID: telegramBot.id }), [telegramBot.id]);
	const links = useMemo(
		() => ({
			[RouteID.TelegramBotMenu]: t('telegramBot'),
			[RouteID.TelegramBotMenuVariables]: t('variables'),
			[RouteID.TelegramBotMenuUsers]: t('users'),
			[RouteID.TelegramBotMenuDatabase]: t('database'),
			[RouteID.TelegramBotMenuConstructor]: t('constructor'),
		}),
		[i18n.language],
	);

	return (
		<Dropdown {...props}>
			<Dropdown.Toggle
				variant='dark'
				className='text-truncate'
				style={toggleButtonStyle}
			>
				{telegramBot.username}
			</Dropdown.Toggle>
			<Dropdown.Menu>
				{Object.entries(links).map(([routeID, text], index) => (
					<Dropdown.Item key={index} as={Link} to={reverse(routeID, params)}>
						{text}
					</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
}

export default memo(TelegramBotMenuDropdown);
