import React, {
	CSSProperties,
	HTMLAttributes,
	memo,
	ReactElement,
	SVGProps,
	useEffect,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { AnimatePresence, AnimationProps, motion } from 'framer-motion';

import Input from 'react-bootstrap/FormControl';

import Loading from 'components/Loading';
import { createMessageToast } from 'components/ToastContainer';

import useTelegramBot from '../hooks/useTelegramBot';

import CheckIcon from 'assets/icons/check.svg';
import XIcon from 'assets/icons/x.svg';

import { TelegramBotAPI } from 'services/api/telegram_bots/main';

const inputStyle: CSSProperties = { fontSize: '16px' };
const iconStyle: CSSProperties = { cursor: 'pointer' };
const iconProps: SVGProps<SVGSVGElement> = { width: 28, height: 28, style: iconStyle };

const animationProps: AnimationProps = {
	variants: { show: { opacity: 1 }, hide: { opacity: 0 } },
	initial: 'hide',
	animate: 'show',
	exit: 'hide',
};

export interface APITokenEditingProps
	extends Pick<HTMLAttributes<HTMLElement>, 'className'> {
	onSaved: () => void;
	onCancel: () => void;
}

function APITokenEditing({
	className,
	onSaved,
	onCancel,
	...props
}: APITokenEditingProps): ReactElement<APITokenEditingProps> {
	const { t } = useTranslation('components', {
		keyPrefix: 'telegramBotBlock.table.apiToken',
	});

	const [telegramBot, setTelegramBot] = useTelegramBot();

	const [loading, setLoading] = useState<boolean>(false);
	const [inputValue, setInputValue] = useState<string>(telegramBot.api_token);

	useEffect(() => setInputValue(telegramBot.api_token), [telegramBot.api_token]);

	async function handleSave(): Promise<void> {
		setLoading(true);

		const response = await TelegramBotAPI.partialUpdate(telegramBot.id, {
			api_token: inputValue,
		});

		if (response.ok) {
			onSaved();
			setTelegramBot(response.json);
			createMessageToast({
				message: t('messages.updateTelegramBotAPIToken.success'),
				level: 'success',
			});
		} else {
			createMessageToast({
				message: t('messages.updateTelegramBotAPIToken.error'),
				level: 'error',
			});
		}

		setLoading(false);
	}

	return (
		<div
			{...props}
			className={classNames('d-flex align-items-center gap-2', className)}
		>
			<Input
				autoFocus
				size='sm'
				value={inputValue}
				placeholder={t('inputPlaceholder')}
				style={inputStyle}
				onChange={(event) => setInputValue(event.target.value)}
			/>
			<div className='d-flex'>
				<AnimatePresence>
					{!loading ? (
						<CheckIcon
							{...iconProps}
							className='text-success'
							onClick={handleSave}
						/>
					) : (
						<motion.div
							{...animationProps}
							className='d-flex align-self-center'
						>
							<Loading size='xxs' />
						</motion.div>
					)}
				</AnimatePresence>
				<XIcon {...iconProps} className='text-danger' onClick={onCancel} />
			</div>
		</div>
	);
}

export default memo(APITokenEditing);
