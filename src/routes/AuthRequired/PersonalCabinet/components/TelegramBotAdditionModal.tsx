import React, { ReactElement, memo, useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Modal, { ModalProps } from 'components/Modal';

import useToast from 'services/hooks/useToast';
import useTelegramBots from '../services/hooks/useTelegramBots';

import { TelegramBotsAPI } from 'services/api/telegram_bots/main';
import { Data } from 'services/api/telegram_bots/types';

type Data = Data.TelegramBotsAPI.Create;

export interface TelegramBotAdditionModalProps extends Omit<ModalProps, 'loading' | 'children'> {
	show: NonNullable<ModalProps['show']>;
	onHide: NonNullable<ModalProps['onHide']>;
}

const defaultData: Data = { api_token: '', is_private: false };

function TelegramBotAdditionModal({ onHide, onExited, ...props }: TelegramBotAdditionModalProps): ReactElement<TelegramBotAdditionModalProps> {
	const { createMessageToast } = useToast();
	const [telegramBots, setTelegramBots] = useTelegramBots();

	const [data, setData] = useState<Data>(defaultData);
	const [loading, setLoading] = useState<boolean>(false);

	function handleExited(node: HTMLElement): void {
		setData(defaultData);
		onExited?.(node);
	}

	async function handleAddButtonClick(): Promise<void> {
		setLoading(true);

		const response = await TelegramBotsAPI.create(data);

		if (response.ok) {
			setTelegramBots([...telegramBots, response.json]);
			onHide();
			createMessageToast({
				message: gettext('Вы успешно добавили Telegram бота.'),
				level: 'success',
			});
		}

		setLoading(false);
	}

	return (
		<Modal
			{...props}
			loading={loading}
			onHide={onHide}
			onExited={handleExited}
		>
			<Modal.Header closeButton>
				<Modal.Title as='h5'>{gettext('Добавление Telegram бота')}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='vstack gap-2'>
				<Form.Control
					value={data.api_token}
					placeholder={gettext('Введите API-токен')}
					onChange={e => setData({ ...data, api_token: e.target.value })}
				/>
				<Form.Switch
					checked={data.is_private}
					label={gettext('Сделать приватным')}
					onChange={e => setData({ ...data, is_private: e.target.checked })}
				/>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant='success'
					onClick={handleAddButtonClick}
				>
					{gettext('Добавить')}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default memo(TelegramBotAdditionModal);