import React, { ReactElement, ReactNode, Dispatch, SetStateAction, ChangeEvent, memo, useEffect, useState } from 'react';
import classNames from 'classnames';

import Card, { CardProps } from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';

import Loading from './Loading';
import TelegramBotStorage from './TelegramBotStorage';

import useToast from 'services/hooks/useToast';

import { TelegramBotAPI } from 'services/api/telegram_bots/main';
import { TelegramBot } from 'services/api/telegram_bots/types';

export interface TelegramBotCardChildrenProps {
	telegramBot: TelegramBot;
	setTelegramBot: Dispatch<SetStateAction<TelegramBot>>;
}

export interface TelegramBotCardProps extends Omit<CardProps, 'children'> {
	telegramBot: TelegramBot;
	children: (props: TelegramBotCardChildrenProps) => ReactNode;
}

function TelegramBotCard({
	telegramBot: initialTelegramBot,
	className,
	children,
	...props
}: TelegramBotCardProps): ReactElement<TelegramBotCardProps> {
	const { createMessageToast } = useToast();

	const [telegramBot, setTelegramBot] = useState<TelegramBot>(initialTelegramBot);

	const [apiTokenInputValue, setAPITokenInputValue] = useState<string>(telegramBot.api_token);
	const [apiTokenIsEditing, setAPITokenIsEditing] = useState<boolean>(false);

	useEffect(() => {
		setTelegramBot(initialTelegramBot);
		setAPITokenInputValue(initialTelegramBot.api_token);
	}, [initialTelegramBot]);

	async function checkStatus(): Promise<void> {
		const response = await TelegramBotAPI.get(telegramBot.id);

		if (response.ok) {
			if (response.json.is_loading) {
				setTimeout(checkStatus, 3000);
			} else {
				setTelegramBot(response.json);
			}
		}
	}

	useEffect(() => {
		if (telegramBot.is_loading) {
			checkStatus();
		}
	}, [telegramBot.is_loading]);

	function toggleAPITokenState(): void {
		if (!apiTokenIsEditing) {
			setAPITokenInputValue(telegramBot.api_token);
		}

		setAPITokenIsEditing(!apiTokenIsEditing);
	}

	async function handleSaveAPIToken(): Promise<void> {
		const response = await TelegramBotAPI.partialUpdate(telegramBot.id, { api_token: apiTokenInputValue });

		if (response.ok) {
			setTelegramBot(response.json);
			toggleAPITokenState();
			createMessageToast({
				message: gettext('Вы успешно обновили API-токен Telegram бота.'),
				level: 'success',
			});
		} else {
			createMessageToast({
				message: gettext('Не удалось обновить API-токен Telegram бота!'),
				level: 'error',
			});
		}
	}

	async function handleIsPrivateChange(event: ChangeEvent<HTMLInputElement>): Promise<void> {
		const response = await TelegramBotAPI.partialUpdate(telegramBot.id, { is_private: event.target.checked });

		if (response.ok) {
			setTelegramBot(response.json);
			createMessageToast({
				message: interpolate(
					gettext('Вы успешно сделали Telegram бота %(private)s.'),
					{ private: response.json.is_private ? gettext('приватным') : gettext('не приватным') },
					true,
				),
				level: 'success',
			});
		} else {
			createMessageToast({
				message: interpolate(
					gettext('Не удалось сделать Telegram бота %(private)s!'),
					{ private: event.target.checked ? gettext('приватным') : gettext('не приватным') },
					true,
				),
				level: 'error',
			});
		}
	}

	return (
		<Card {...props} className={classNames('border-0', className)}>
			<Card.Header as='h5' {...(
				telegramBot.is_loading ? {
					className: 'd-flex justify-content-center text-bg-secondary border-secondary',
					children: <Loading size='xs' />,
				} : telegramBot.is_enabled ? {
					className: 'text-bg-success border-success fw-semibold text-center',
					children: gettext('Telegram бот включен'),
				} : {
					className: 'text-bg-danger border-danger fw-semibold text-center',
					children: gettext('Telegram бот выключен'),
				}
			)} />
			<Card.Body className='border p-2'>
				<Table size='sm' borderless className='align-middle mb-0'>
					<tbody>
						<tr>
							<th scope='row'>@username:</th>
							<td className='text-break'>
								<a
									className='link-dark link-underline-opacity-0'
									href={`tg://resolve?domain=${telegramBot.username}`}
								>
									@{telegramBot.username}
								</a>
							</td>
						</tr>
						<tr>
							<th scope='row'>{gettext('API-токен')}:</th>
							<td>
								<div className='d-flex align-items-center gap-2'>
									{apiTokenIsEditing ? (
										<Form.Control
											size='sm'
											autoFocus
											value={apiTokenInputValue}
											placeholder={gettext('Введите API-токен')}
											style={{ fontSize: '16px' }}
											onChange={event => setAPITokenInputValue(event.target.value)}
										/>
									) : (
										<span className='text-break flex-fill'>{telegramBot.api_token}</span>
									)}
									{apiTokenIsEditing ? (
										<div className='d-flex'>
											<i
												className='d-flex bi bi-check text-success'
												style={{
													cursor: 'pointer',
													fontSize: '28px',
												}}
												onClick={handleSaveAPIToken}
											/>
											<i
												className='d-flex bi bi-x text-danger'
												style={{
													cursor: 'pointer',
													fontSize: '28px',
													WebkitTextStroke: '0.4px',
												}}
												onClick={toggleAPITokenState}
											/>
										</div>
									) : (
										<i
											className='d-flex bi bi-pencil-square text-secondary'
											style={{
												cursor: 'pointer',
												fontSize: '18px',
											}}
											onClick={toggleAPITokenState}
										/>
									)}
								</div>
							</td>
						</tr>
						<tr>
							<th scope='row'>{gettext('Хранилище')}:</th>
							<td><TelegramBotStorage telegramBot={telegramBot} /></td>
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
			{children?.({ telegramBot, setTelegramBot })}
		</Card>
	);
}

export default memo(TelegramBotCard);