import React, { ReactElement, Dispatch, SetStateAction, memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import Loading from 'components/Loading';
import AskConfirmModal from 'components/AskConfirmModal';

import useToast from 'services/hooks/useToast';

import { TelegramBotAPI } from 'services/api/telegram_bots/main';
import { TelegramBot } from 'services/api/telegram_bots/types';

export interface TelegramBotCardFooterProps {
	telegramBot: TelegramBot;
	setTelegramBot: Dispatch<SetStateAction<TelegramBot>>;
}

function TelegramBotCardFooter({ telegramBot, setTelegramBot }: TelegramBotCardFooterProps): ReactElement<TelegramBotCardFooterProps> {
	const navigate = useNavigate();

	const { createMessageToast } = useToast();

	const [showDeletionModal, setShowDeletingModal] = useState<boolean>(false);
	const [loadingDeletionModal, setLoadingDeletingModal] = useState<boolean>(false);

	async function handleConfirmDelete(): Promise<void> {
		setLoadingDeletingModal(true);

		const response = await TelegramBotAPI._delete(telegramBot.id);

		if (response.ok) {
			setShowDeletingModal(false);
			navigate('/personal-cabinet/');
			createMessageToast({
				message: gettext('Вы успешно удалили Telegram бота.'),
				level: 'success',
			});
		} else {
			createMessageToast({
				message: gettext('Не удалось удалить Telegram бота!'),
				level: 'error',
			});
		}

		setLoadingDeletingModal(false);
	}

	async function handleButtonClick(action: 'start' | 'restart' | 'stop'): Promise<void> {
		const response = await TelegramBotAPI[action](telegramBot.id);

		if (response.ok) {
			setTelegramBot({ ...telegramBot, is_loading: true });

			if (action === 'start') {
				createMessageToast({
					message: gettext('Выполняется включение Telegram бота...'),
					level: 'info',
				});
			} else if (action === 'restart') {
				createMessageToast({
					message: gettext('Выполняется перезагрузка Telegram бота...'),
					level: 'info',
				});
			} else if (action === 'stop') {
				createMessageToast({
					message: gettext('Выполняется выключение Telegram бота...'),
					level: 'info',
				});
			}
		} else {
			if (action === 'start') {
				createMessageToast({
					message: gettext('Не удалось включить Telegram бота!'),
					level: 'error',
				});
			} else if (action === 'restart') {
				createMessageToast({
					message: gettext('Не удалось перезагрузить Telegram бота!'),
					level: 'error',
				});
			} else if (action === 'stop') {
				createMessageToast({
					message: gettext('Не удалось выключить Telegram бота!'),
					level: 'error',
				});
			}
		}
	}

	return (
		<>
			<AskConfirmModal
				show={showDeletionModal}
				loading={loadingDeletionModal}
				title={gettext('Удаление Telegram бота')}
				onConfirm={handleConfirmDelete}
				onHide={useCallback(() => setShowDeletingModal(false), [])}
			>
				{gettext('Вы точно хотите удалить Telegram бота?')}
			</AskConfirmModal>
			<Card.Footer className='d-flex flex-wrap border border-top-0 p-3 gap-3'>
				{telegramBot.is_loading ? (
					<Button
						disabled
						variant='secondary'
						className='flex-fill d-flex justify-content-center'
					>
						<Loading size='xs' />
					</Button>
				) : telegramBot.is_enabled ? (
					<>
						<Button
							variant='danger'
							className='flex-fill'
							onClick={() => handleButtonClick('stop')}
						>
							{gettext('Выключить')}
						</Button>
						<Button
							variant='success'
							className='flex-fill'
							onClick={() => handleButtonClick('restart')}
						>
							{gettext('Перезагрузить')}
						</Button>
					</>
				) : (
					<Button
						variant='success'
						className='flex-fill'
						onClick={() => handleButtonClick('start')}
					>
						{gettext('Включить')}
					</Button>
				)}
				<Button
					variant='danger'
					className='flex-fill'
					onClick={() => setShowDeletingModal(true)}
				>
					{gettext('Удалить')}
				</Button>
			</Card.Footer>
		</>
	);
}

export default memo(TelegramBotCardFooter);