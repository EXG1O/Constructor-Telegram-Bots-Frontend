import React, { memo, ReactElement, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import CardFooter, { CardFooterProps } from 'react-bootstrap/CardFooter';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import Loading from 'components/Loading';
import useTelegramBot from 'components/TelegramBotBlock/hooks/useTelegramBot';
import { createMessageToast } from 'components/ToastContainer';

import { TelegramBotAPI } from 'services/api/telegram_bots/main';

export type TelegramBotBlockFooterProps = Omit<CardFooterProps, 'as' | 'children'>;

function TelegramBotBlockFooter(
	props: TelegramBotBlockFooterProps,
): ReactElement<TelegramBotBlockFooterProps> {
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

	async function handleAction(action: 'start' | 'restart' | 'stop'): Promise<void> {
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
		<CardFooter {...props} as={Row} className='g-3'>
			{telegramBot.is_loading ? (
				<Col>
					<Button
						disabled
						variant='secondary'
						className='w-100 d-flex justify-content-center'
					>
						<Loading size='xs' />
					</Button>
				</Col>
			) : telegramBot.is_enabled ? (
				<>
					<Col>
						<Button
							variant='danger'
							className='w-100'
							onClick={() => handleAction('stop')}
						>
							{gettext('Выключить')}
						</Button>
					</Col>
					<Col>
						<Button
							variant='success'
							className='w-100'
							onClick={() => handleAction('restart')}
						>
							{gettext('Перезагрузить')}
						</Button>
					</Col>
				</>
			) : (
				<Col>
					<Button
						variant='success'
						className='w-100'
						onClick={() => handleAction('start')}
					>
						{gettext('Включить')}
					</Button>
				</Col>
			)}
			<Col {...(telegramBot.is_enabled ? { xs: '12', sm: true } : {})}>
				<Button variant='danger' className='w-100' onClick={showDeleteModal}>
					{gettext('Удалить')}
				</Button>
			</Col>
		</CardFooter>
	);
}

export default memo(TelegramBotBlockFooter);
