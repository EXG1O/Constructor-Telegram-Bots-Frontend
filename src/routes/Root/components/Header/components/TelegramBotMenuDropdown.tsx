import React, { memo, ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { reverse } from 'routes';

import Dropdown, { DropdownProps } from 'react-bootstrap/Dropdown';

import { TelegramBot } from 'services/api/telegram_bots/types';

export interface TelegramBotMenuDropdownProps extends Omit<DropdownProps, 'children'> {
	telegramBot: TelegramBot;
}

const baseID: string = 'telegram-bot-menu';

function TelegramBotMenuDropdown({
	telegramBot,
	...props
}: TelegramBotMenuDropdownProps): ReactElement<TelegramBotMenuDropdownProps> {
	const { t } = useTranslation('root', { keyPrefix: 'telegramBotMenuDropdown' });

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
					{t('telegramBot')}
				</Dropdown.Item>
				<Dropdown.Item as={Link} to={reverse(`${baseID}-variables`, params)}>
					{t('variables')}
				</Dropdown.Item>
				<Dropdown.Item as={Link} to={reverse(`${baseID}-users`, params)}>
					{t('users')}
				</Dropdown.Item>
				<Dropdown.Item as={Link} to={reverse(`${baseID}-database`, params)}>
					{t('database')}
				</Dropdown.Item>
				<Dropdown.Item as={Link} to={reverse(`${baseID}-constructor`, params)}>
					{t('constructor')}
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
}

export default memo(TelegramBotMenuDropdown);
