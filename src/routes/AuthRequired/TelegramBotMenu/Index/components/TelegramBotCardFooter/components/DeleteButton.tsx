import React, { ReactElement, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button, { ButtonProps } from 'react-bootstrap/Button';

import AskConfirmModal from 'components/AskConfirmModal';

import useToast from 'services/hooks/useToast';

import useTelegramBot from 'components/TelegramBotCard/hooks/useTelegramBot';

import { TelegramBotAPI } from 'services/api/telegram_bots/main';

export type DeleteButtonProps = Omit<ButtonProps, 'children'>;

function DeleteButton({
	onClick,
	...props
}: DeleteButtonProps): ReactElement<DeleteButtonProps> {
	const navigate = useNavigate();

	const { createMessageToast } = useToast();

	const [telegramBot, setTelegramBot] = useTelegramBot();

	const [showModal, setShowModal] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
		onClick?.(event);
		setShowModal(true);
	}

	const handleConfirm = useCallback(async () => {
		setLoading(true);

		const response = await TelegramBotAPI._delete(telegramBot.id);

		if (response.ok) {
			setShowModal(false);
			navigate('/personal-cabinet/');
			createMessageToast({
				message: gettext('Вы успешно удалили Telegram бота.'),
				level: 'success',
			});
		} else {
			createMessageToast({
				message: gettext('Не удалось удалить Telegram бота.'),
				level: 'error',
			});
		}

		setLoading(false);
	}, [telegramBot]);

	return (
		<>
			<AskConfirmModal
				show={showModal}
				loading={loading}
				title={gettext('Удаление Telegram бота')}
				onConfirm={handleConfirm}
				onHide={useCallback(() => setShowModal(false), [])}
			>
				{gettext('Вы точно хотите удалить Telegram бота?')}
			</AskConfirmModal>
			<Button variant='danger' {...props} onClick={handleClick}>
				{gettext('Удалить')}
			</Button>
		</>
	);
}

export default DeleteButton;
