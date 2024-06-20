import React, { ReactElement, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import CardFooter, { CardFooterProps } from 'react-bootstrap/CardFooter';
import Button from 'react-bootstrap/Button';

import Loading from 'components/Loading';

import { createMessageToast } from 'components/ToastContainer';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';

import useTelegramBot from 'components/TelegramBotCard/hooks/useTelegramBot';

import { TelegramBotAPI } from 'services/api/telegram_bots/main';

export type TelegramBotCardFooterProps = Omit<CardFooterProps, 'children'>;

function TelegramBotCardFooter(
	props: TelegramBotCardFooterProps,
): ReactElement<TelegramBotCardFooterProps> {
	const navigate = useNavigate();

	const [telegramBot, setTelegramBot] = useTelegramBot();

	const setShowAskConfirmModal = useAskConfirmModalStore((state) => state.setShow);
	const hideAskConfirmModal = useAskConfirmModalStore((state) => state.setHide);
	const setLoadingAskConfirmModal = useAskConfirmModalStore(
		(state) => state.setLoading,
	);

	const showDeleteModal = useCallback(
		() =>
			setShowAskConfirmModal({
				title: gettext('Удаление Telegram бота'),
				text: gettext('Вы точно хотите удалить Telegram бота?'),
				onConfirm: async () => {
					setLoadingAskConfirmModal(true);

					const response = await TelegramBotAPI._delete(telegramBot.id);

					if (response.ok) {
						hideAskConfirmModal();
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

					setLoadingAskConfirmModal(false);
				},
				onCancel: null,
			}),
		[],
	);

	async function handleButtonClick(
		action: 'start' | 'restart' | 'stop',
	): Promise<void> {
		const response = await TelegramBotAPI[action](telegramBot.id);

		if (response.ok) {
			setTelegramBot({ ...telegramBot, is_loading: true });

			const actionText: string =
				action === 'start'
					? gettext('включение')
					: action === 'restart'
						? gettext('перезагрузка')
						: gettext('выключение');

			createMessageToast({
				message: interpolate(
					gettext('Выполняется %(action)s Telegram бота.'),
					{ action: actionText },
					true,
				),
				level: 'info',
			});
		} else {
			const actionText: string =
				action === 'start'
					? gettext('включить')
					: action === 'restart'
						? gettext('перезагрузить')
						: gettext('выключить');

			createMessageToast({
				message: interpolate(
					gettext('Не удалось %(action)s Telegram бота.'),
					{ action: actionText },
					true,
				),
				level: 'error',
			});
		}
	}

	return (
		<CardFooter
			{...props}
			className='d-flex flex-wrap border border-top-0 p-3 gap-3'
		>
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
			<Button variant='danger' className='flex-fill' onClick={showDeleteModal}>
				{gettext('Удалить')}
			</Button>
		</CardFooter>
	);
}

export default memo(TelegramBotCardFooter);
