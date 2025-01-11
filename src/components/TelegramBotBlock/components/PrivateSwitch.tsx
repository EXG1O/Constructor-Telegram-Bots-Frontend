import React, {
	ChangeEventHandler,
	HTMLAttributes,
	memo,
	ReactElement,
	useCallback,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import Check from 'components/Check';
import Loading from 'components/Loading';
import { createMessageToast } from 'components/ToastContainer';

import useTelegramBot from '../hooks/useTelegramBot';

import { TelegramBotAPI } from 'api/telegram_bots/main';

export type PrivateSwitchProps = Pick<HTMLAttributes<HTMLElement>, 'className'>;

function PrivateSwitch(props: PrivateSwitchProps): ReactElement<PrivateSwitchProps> {
	const { t } = useTranslation('components', {
		keyPrefix: 'telegramBotBlock.table.private',
	});

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
					message: t('messages.updateTelegramBotPrivate.success', {
						context: String(response.json.is_private),
					}),
					level: 'success',
				});
			} else {
				createMessageToast({
					message: t('messages.updateTelegramBotPrivate.error', {
						context: String(event.target.checked),
					}),
					level: 'error',
				});
			}

			setLoading(false);
		},
		[telegramBot.id],
	);

	return !loading ? (
		<Check
			{...props}
			type='switch'
			checked={telegramBot.is_private}
			onChange={handleChange}
		/>
	) : (
		<Loading size='xxs' />
	);
}

export default memo(PrivateSwitch);
