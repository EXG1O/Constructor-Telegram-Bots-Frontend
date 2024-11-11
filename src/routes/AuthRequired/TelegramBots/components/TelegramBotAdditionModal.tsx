import React, { memo, ReactElement, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Feedback from 'react-bootstrap/Feedback';
import Input from 'react-bootstrap/FormControl';
import Switch from 'react-bootstrap/Switch';

import Button from 'components/Button';
import Modal, { ModalProps } from 'components/Modal';
import { createMessageToast } from 'components/ToastContainer';

import useTelegramBots from '../hooks/useTelegramBots';

import { APIResponse } from 'services/api/core';
import { TelegramBotsAPI } from 'services/api/telegram_bots/main';
import { Data } from 'services/api/telegram_bots/types';

type Data = Data.TelegramBotsAPI.Create;

export interface TelegramBotAdditionModalProps
	extends Omit<ModalProps, 'loading' | 'children'> {
	show: NonNullable<ModalProps['show']>;
	onHide: NonNullable<ModalProps['onHide']>;
}

const defaultData: Data = { api_token: '', is_private: false };

function TelegramBotAdditionModal({
	onHide,
	onExited,
	...props
}: TelegramBotAdditionModalProps): ReactElement<TelegramBotAdditionModalProps> {
	const { t } = useTranslation(RouteID.TelegramBots, {
		keyPrefix: 'telegramBotAdditionModal',
	});

	const [telegramBots, setTelegramBots] = useTelegramBots();

	const [data, setData] = useState<Data>(defaultData);
	const [errors, setErrors] = useState<APIResponse.ErrorDetail[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const apiTokenError = useMemo<APIResponse.ErrorDetail | undefined>(
		() => errors.find((error) => error.attr === 'api_token'),
		[errors],
	);
	const privateError = useMemo<APIResponse.ErrorDetail | undefined>(
		() => errors.find((error) => error.attr === 'is_private'),
		[errors],
	);

	function handleExited(node: HTMLElement): void {
		onExited?.(node);
		setData(defaultData);
	}

	async function handleAdd(): Promise<void> {
		setLoading(true);

		const response = await TelegramBotsAPI.create(data);

		if (response.ok) {
			setTelegramBots([...telegramBots, response.json]);
			onHide();
			createMessageToast({
				message: t('messages.createTelegramBot.success'),
				level: 'success',
			});
		} else if (response.json.type === 'validation_error') {
			setErrors(response.json.errors);
		} else {
			createMessageToast({
				message: t('messages.createTelegramBot.error'),
				level: 'error',
			});
		}

		setLoading(false);
	}

	return (
		<Modal {...props} loading={loading} onHide={onHide} onExited={handleExited}>
			<Modal.Header closeButton>
				<Modal.Title>{t('title')}</Modal.Title>
			</Modal.Header>
			<Modal.Body className='vstack gap-2'>
				<div>
					<Input
						value={data.api_token}
						isInvalid={Boolean(apiTokenError)}
						placeholder={t('apiTokenInputPlaceholder')}
						onChange={(e) =>
							setData({ ...data, api_token: e.target.value })
						}
					/>
					{apiTokenError && (
						<Feedback type='invalid'>{apiTokenError.detail}</Feedback>
					)}
				</div>
				<div>
					<Switch
						checked={data.is_private}
						isInvalid={Boolean(privateError)}
						label={t('privateSwitchLabel')}
						onChange={(e) =>
							setData({ ...data, is_private: e.target.checked })
						}
					/>
					{privateError && (
						<Feedback type='invalid'>{privateError.detail}</Feedback>
					)}
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant='success' onClick={handleAdd}>
					{t('addButton')}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default memo(TelegramBotAdditionModal);
