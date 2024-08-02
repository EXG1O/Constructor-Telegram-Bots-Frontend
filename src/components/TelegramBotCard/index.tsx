import React, {
	memo,
	ReactElement,
	TdHTMLAttributes,
	useCallback,
	useEffect,
	useState,
} from 'react';
import classNames from 'classnames';

import Table from 'react-bootstrap/Table';

import Block, { BlockProps } from 'components/Block';
import TelegramBotStorage from 'components/TelegramBotStorage';
import { createMessageToast } from 'components/ToastContainer';

import APITokenDisplay from './components/APITokenDisplay';
import APITokenEditing from './components/APITokenEditing';
import PrivateSwitch from './components/PrivateSwitch';
import TelegramBotContext from './contexts/TelegramBotContext';

import { TelegramBotAPI } from 'services/api/telegram_bots/main';
import { TelegramBot } from 'services/api/telegram_bots/types';

export interface TelegramBotCardProps extends Omit<BlockProps, 'variant' | 'gradient'> {
	telegramBot: TelegramBot;
}

const loadingStatusProps: TdHTMLAttributes<HTMLTableCellElement> = {
	className: 'text-secondary',
	children: gettext('Загрузка'),
};
const enabledStatusProps: TdHTMLAttributes<HTMLTableCellElement> = {
	className: 'text-success',
	children: gettext('Включен'),
};
const disabledStatusProps: TdHTMLAttributes<HTMLTableCellElement> = {
	className: 'text-danger',
	children: gettext('Выключен'),
};

function TelegramBotCard({
	telegramBot: initialTelegramBot,
	className,
	children,
	...props
}: TelegramBotCardProps): ReactElement<TelegramBotCardProps> {
	const [telegramBot, setTelegramBot] = useState<TelegramBot>(initialTelegramBot);
	const [apiTokenEditing, setAPITokenEditing] = useState<boolean>(false);

	useEffect(() => setTelegramBot(initialTelegramBot), [initialTelegramBot]);

	const toggleAPITokenState = useCallback(
		() => setAPITokenEditing(!apiTokenEditing),
		[apiTokenEditing],
	);

	useEffect(() => {
		const checkStatus = async () => {
			if (!telegramBot.is_loading) return;

			const response = await TelegramBotAPI.get(telegramBot.id);

			if (!response.ok || response.json.is_loading) {
				if (!response.ok) {
					createMessageToast({
						message: gettext('Не удалось получить данные о Telegram боте.'),
						level: 'error',
					});
				}

				setTimeout(checkStatus, 3000);
				return;
			}

			setTelegramBot(response.json);
		};

		checkStatus();
	}, [telegramBot.is_loading]);

	return (
		<TelegramBotContext.Provider value={[telegramBot, setTelegramBot]}>
			<Block
				{...props}
				variant='light'
				className={classNames(className, 'd-flex flex-column gap-2')}
			>
				<h4 className='fw-semibold text-center'>
					<a
						className='text-reset text-decoration-none'
						href={`https://t.me/${telegramBot.username}`}
						rel='noreferrer'
						target='_blank'
					>
						{telegramBot.username}
					</a>
				</h4>
				<Table size='sm' borderless className='align-middle mb-0'>
					<tbody>
						<tr>
							<th scope='row'>{gettext('Статус')}:</th>
							<td
								{...(telegramBot.is_loading
									? loadingStatusProps
									: telegramBot.is_enabled
										? enabledStatusProps
										: disabledStatusProps)}
							/>
						</tr>
						<tr>
							<th scope='row'>{gettext('API-токен')}:</th>
							<td className='w-100'>
								{apiTokenEditing ? (
									<APITokenEditing
										onSaved={toggleAPITokenState}
										onCancel={toggleAPITokenState}
									/>
								) : (
									<APITokenDisplay onEdit={toggleAPITokenState} />
								)}
							</td>
						</tr>
						<tr>
							<th scope='row'>{gettext('Приватный')}:</th>
							<td>
								<PrivateSwitch />
							</td>
						</tr>
						<tr>
							<th scope='row'>{gettext('Хранилище')}:</th>
							<td>
								<TelegramBotStorage telegramBot={telegramBot} />
							</td>
						</tr>
						<tr>
							<th scope='row'>{gettext('Добавлен')}:</th>
							<td>{telegramBot.added_date}</td>
						</tr>
					</tbody>
				</Table>
				{children}
			</Block>
		</TelegramBotContext.Provider>
	);
}

export default memo(TelegramBotCard);
