import React, {
	ChangeEventHandler,
	HTMLAttributes,
	memo,
	ReactElement,
	useCallback,
	useState,
} from 'react';
import { AnimatePresence, AnimationProps, motion } from 'framer-motion';

import Switch from 'react-bootstrap/Switch';

import Loading from 'components/Loading';
import { createMessageToast } from 'components/ToastContainer';

import useTelegramBot from '../hooks/useTelegramBot';

import { TelegramBotAPI } from 'services/api/telegram_bots/main';

export type PrivateSwitchProps = Pick<HTMLAttributes<HTMLElement>, 'className'>;

const animationProps: AnimationProps = {
	variants: { show: { opacity: 1 }, hide: { opacity: 0 } },
	initial: 'hide',
	animate: 'show',
	exit: 'hide',
};

function PrivateSwitch(props: PrivateSwitchProps): ReactElement<PrivateSwitchProps> {
	const [telegramBot, setTelegramBot] = useTelegramBot();

	const [loading, setLoading] = useState<boolean>(false);

	const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		async (event) => {
			setLoading(true);

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

			setLoading(false);
		},
		[telegramBot.id],
	);

	return (
		<AnimatePresence>
			{!loading ? (
				<Switch
					{...props}
					{...animationProps}
					as={motion.input}
					checked={telegramBot.is_private}
					onChange={handleChange}
				/>
			) : (
				<motion.div {...animationProps} className='d-flex align-content-center'>
					<Loading size='xxs' />
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default memo(PrivateSwitch);
