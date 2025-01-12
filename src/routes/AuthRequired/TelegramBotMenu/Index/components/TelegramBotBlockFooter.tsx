import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { reverse, RouteID } from 'routes';

import { CardFooterProps } from 'react-bootstrap/CardFooter';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import Button from 'components/Button';
import Card from 'components/Card';
import Loading from 'components/Loading';
import useTelegramBot from 'components/TelegramBotBlock/hooks/useTelegramBot';
import { createMessageToast } from 'components/ToastContainer';

import { TelegramBotAPI } from 'api/telegram_bots/main';

export type TelegramBotBlockFooterProps = Omit<CardFooterProps, 'as' | 'children'>;

function TelegramBotBlockFooter(
	props: TelegramBotBlockFooterProps,
): ReactElement<TelegramBotBlockFooterProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenu, {
		keyPrefix: 'telegramBotBlockFooter',
	});

	const navigate = useNavigate();

	const [telegramBot, setTelegramBot] = useTelegramBot();

	const setShowAskConfirmModal = useAskConfirmModalStore((state) => state.setShow);
	const hideAskConfirmModal = useAskConfirmModalStore((state) => state.setHide);
	const setLoadingAskConfirmModal = useAskConfirmModalStore(
		(state) => state.setLoading,
	);

	function showDeleteModal(): void {
		setShowAskConfirmModal({
			title: t('deleteModal.title'),
			text: t('deleteModal.text'),
			onConfirm: async () => {
				setLoadingAskConfirmModal(true);

				const response = await TelegramBotAPI.delete(telegramBot.id);

				if (response.ok) {
					hideAskConfirmModal();
					navigate(reverse(RouteID.TelegramBots));
					createMessageToast({
						message: t('messages.deleteTelegramBot.success'),
						level: 'success',
					});
				} else {
					createMessageToast({
						message: t('messages.deleteTelegramBot.error'),
						level: 'error',
					});
				}

				setLoadingAskConfirmModal(false);
			},
			onCancel: null,
		});
	}

	async function handleAction(action: 'start' | 'restart' | 'stop'): Promise<void> {
		const response = await TelegramBotAPI[action](telegramBot.id);

		if (!response.ok) {
			createMessageToast({
				message: t(`messages.${action}TelegramBot.error`),
				level: 'error',
			});
		}

		setTelegramBot({ ...telegramBot, is_loading: true });
		createMessageToast({
			message: t(`messages.${action}TelegramBot.success`),
			level: 'info',
		});
	}

	return (
		<Card.Footer {...props} as={Row} className='g-3'>
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
							{t('stopButton')}
						</Button>
					</Col>
					<Col>
						<Button
							variant='success'
							className='w-100'
							onClick={() => handleAction('restart')}
						>
							{t('restartButton')}
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
						{t('startButton')}
					</Button>
				</Col>
			)}
			<Col {...(telegramBot.is_enabled ? { xs: '12', sm: true } : {})}>
				<Button variant='danger' className='w-100' onClick={showDeleteModal}>
					{t('deleteButton')}
				</Button>
			</Col>
		</Card.Footer>
	);
}

export default memo(TelegramBotBlockFooter);
