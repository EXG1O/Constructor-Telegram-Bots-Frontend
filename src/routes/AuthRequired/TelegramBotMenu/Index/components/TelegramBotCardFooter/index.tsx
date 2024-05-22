import React, { ReactElement, memo } from 'react';

import CardFooter, { CardFooterProps } from 'react-bootstrap/CardFooter';
import Button from 'react-bootstrap/Button';

import Loading from 'components/Loading';

import useToast from 'services/hooks/useToast';

import useTelegramBot from 'components/TelegramBotCard/hooks/useTelegramBot';

import { TelegramBotAPI } from 'services/api/telegram_bots/main';
import DeleteButton from './components/DeleteButton';

export type TelegramBotCardFooterProps = Omit<CardFooterProps, 'children'>;

function TelegramBotCardFooter(
	props: TelegramBotCardFooterProps,
): ReactElement<TelegramBotCardFooterProps> {
	const { createMessageToast } = useToast();

	const [telegramBot, setTelegramBot] = useTelegramBot();

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
			<DeleteButton className='flex-fill' />
		</CardFooter>
	);
}

export default memo(TelegramBotCardFooter);
