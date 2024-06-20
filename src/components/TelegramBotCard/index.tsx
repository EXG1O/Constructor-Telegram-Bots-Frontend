import React, { ReactElement, memo, useEffect, useState } from 'react';
import classNames from 'classnames';

import Card, { CardProps } from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

import TelegramBotStorage from '../TelegramBotStorage';

import { createMessageToast } from 'components/ToastContainer';

import Header from './components/Header';
import APITokenDisplay from './components/APITokenDisplay';

import TelegramBotContext from './contexts/TelegramBotContext';

import { TelegramBotAPI } from 'services/api/telegram_bots/main';
import { TelegramBot } from 'services/api/telegram_bots/types';

export interface TelegramBotCardProps extends CardProps {
	telegramBot: TelegramBot;
}

function TelegramBotCard({
	telegramBot: initialTelegramBot,
	className,
	children,
	...props
}: TelegramBotCardProps): ReactElement<TelegramBotCardProps> {
	const [telegramBot, setTelegramBot] = useState<TelegramBot>(initialTelegramBot);

	useEffect(() => setTelegramBot(initialTelegramBot), [initialTelegramBot]);

	async function checkStatus(): Promise<void> {
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
	}

	useEffect(() => {
		checkStatus();
	}, [telegramBot.is_loading]);

	async function handleIsPrivateChange(
		event: React.ChangeEvent<HTMLInputElement>,
	): Promise<void> {
		const response = await TelegramBotAPI.partialUpdate(telegramBot.id, {
			is_private: event.target.checked,
		});

		if (response.ok) {
			setTelegramBot(response.json);
			createMessageToast({
				message: interpolate(
					gettext('Вы успешно сделали Telegram бота %(private)s.'),
					{
						private: response.json.is_private
							? gettext('приватным')
							: gettext('не приватным'),
					},
					true,
				),
				level: 'success',
			});
		} else {
			createMessageToast({
				message: interpolate(
					gettext('Не удалось сделать Telegram бота %(private)s.'),
					{
						private: event.target.checked
							? gettext('приватным')
							: gettext('не приватным'),
					},
					true,
				),
				level: 'error',
			});
		}
	}

	return (
		<TelegramBotContext.Provider value={[telegramBot, setTelegramBot]}>
			<Card {...props} className={classNames('border-0', className)}>
				<Header />
				<Card.Body className='border p-2'>
					<Table size='sm' borderless className='align-middle mb-0'>
						<tbody>
							<tr>
								<th scope='row'>@username:</th>
								<td className='text-break w-100'>
									<a
										className='text-reset text-decoration-none'
										href={`tg://resolve?domain=${telegramBot.username}`}
									>
										@{telegramBot.username}
									</a>
								</td>
							</tr>
							<tr>
								<th scope='row'>{gettext('API-токен')}:</th>
								<td>
									<APITokenDisplay />
								</td>
							</tr>
							<tr>
								<th scope='row'>{gettext('Хранилище')}:</th>
								<td>
									<TelegramBotStorage telegramBot={telegramBot} />
								</td>
							</tr>
							<tr>
								<th scope='row'>{gettext('Приватный')}:</th>
								<td>
									<Form.Switch
										checked={telegramBot.is_private}
										onChange={handleIsPrivateChange}
									/>
								</td>
							</tr>
							<tr>
								<th scope='row'>{gettext('Добавлен')}:</th>
								<td>{telegramBot.added_date}</td>
							</tr>
						</tbody>
					</Table>
				</Card.Body>
				{children}
			</Card>
		</TelegramBotContext.Provider>
	);
}

export default memo(TelegramBotCard);
