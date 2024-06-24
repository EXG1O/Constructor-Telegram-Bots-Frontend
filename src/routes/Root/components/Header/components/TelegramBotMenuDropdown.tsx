import React, { ReactElement, memo, useMemo } from 'react';

import { Link } from 'react-router-dom';

import Dropdown, { DropdownProps } from 'react-bootstrap/Dropdown';

import { reverse } from 'routes';

import { TelegramBot } from 'services/api/telegram_bots/types';

export interface TelegramBotMenuDropdownProps extends Omit<DropdownProps, 'children'> {
	telegramBot: TelegramBot;
}

const baseID: string = 'telegram-bot-menu';

function TelegramBotMenuDropdown({
	telegramBot,
	...props
}: TelegramBotMenuDropdownProps): ReactElement<TelegramBotMenuDropdownProps> {
	const params = useMemo(() => ({ telegramBotID: telegramBot.id }), [telegramBot.id]);

	return (
		<Dropdown {...props}>
			<Dropdown.Toggle
				variant='dark'
				className='text-truncate'
				style={{ maxWidth: '150px' }}
			>
				{telegramBot.username}
			</Dropdown.Toggle>
			<Dropdown.Menu>
				<Dropdown.Item as={Link} to={reverse(`${baseID}-index`, params)}>
					{gettext('Telegram бот')}
				</Dropdown.Item>
				<Dropdown.Item as={Link} to={reverse(`${baseID}-variables`, params)}>
					{gettext('Переменные')}
				</Dropdown.Item>
				<Dropdown.Item as={Link} to={reverse(`${baseID}-users`, params)}>
					{gettext('Пользователи')}
				</Dropdown.Item>
				<Dropdown.Item as={Link} to={reverse(`${baseID}-database`, params)}>
					{gettext('База данных')}
				</Dropdown.Item>
				<Dropdown.Item as={Link} to={reverse(`${baseID}-constructor`, params)}>
					{gettext('Конструктор')}
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
}

export default memo(TelegramBotMenuDropdown);
