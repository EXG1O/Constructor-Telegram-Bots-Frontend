import React, {
	ReactElement,
	HTMLAttributes,
	CSSProperties,
	useMemo,
	useEffect,
	useState,
} from 'react';
import classNames from 'classnames';

import PencilSquareIcon from 'assets/icons/pencil-square.svg';
import EyeIcon from 'assets/icons/eye.svg';
import EyeSlashIcon from 'assets/icons/eye-slash.svg';
import CheckIcon from 'assets/icons/check.svg';
import XIcon from 'assets/icons/x.svg';

import Input from 'react-bootstrap/FormControl';

import useToast from 'services/hooks/useToast';
import useTelegramBot from '../hooks/useTelegramBot';

import { TelegramBotAPI } from 'services/api/telegram_bots/main';

export type APITokenDisplayProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

const iconStyle: CSSProperties = { cursor: 'pointer' };

function APITokenDisplay({
	className,
	...props
}: APITokenDisplayProps): ReactElement<APITokenDisplayProps> {
	const { createMessageToast } = useToast();

	const [telegramBot, setTelegramBot] = useTelegramBot();

	const [inputValue, setInputValue] = useState<string>(telegramBot.api_token);
	const [isShow, setShow] = useState<boolean>(false);
	const [isEditing, setEditing] = useState<boolean>(false);

	const hiddenAPIToken = useMemo<string>(() => {
		const [id, token] = telegramBot.api_token.split(':');

		return (
			id +
			':' +
			token.slice(undefined, 3) +
			'*'.repeat(token.length - 6) +
			token.slice(token.length - 3)
		);
	}, [telegramBot.api_token]);

	useEffect(() => setInputValue(telegramBot.api_token), [telegramBot.api_token]);

	function toggleEditingState(): void {
		if (!isEditing) {
			setInputValue(telegramBot.api_token);
		}

		setEditing(!isEditing);
	}

	async function handleSave(): Promise<void> {
		const response = await TelegramBotAPI.partialUpdate(telegramBot.id, {
			api_token: inputValue,
		});

		if (response.ok) {
			setEditing(false);
			setTelegramBot(response.json);
			createMessageToast({
				message: gettext('Вы успешно обновили API-токен Telegram бота.'),
				level: 'success',
			});
		} else {
			createMessageToast({
				message: gettext('Не удалось обновить API-токен Telegram бота.'),
				level: 'error',
			});
		}
	}

	return (
		<div
			{...props}
			className={classNames('d-flex align-items-center gap-2', className)}
		>
			{isEditing ? (
				<Input
					size='sm'
					autoFocus
					value={inputValue}
					placeholder={gettext('Введите API-токен')}
					style={{ fontSize: '16px' }}
					onChange={(event) => setInputValue(event.target.value)}
				/>
			) : (
				<span className='text-break flex-fill'>
					{!isShow ? hiddenAPIToken : telegramBot.api_token}
				</span>
			)}
			{isEditing ? (
				<div className='d-flex'>
					<CheckIcon
						width={28}
						height={28}
						className='text-success'
						style={iconStyle}
						onClick={handleSave}
					/>
					<XIcon
						width={28}
						height={28}
						className='text-danger'
						style={iconStyle}
						onClick={toggleEditingState}
					/>
				</div>
			) : (
				<div className='d-flex gap-2'>
					<PencilSquareIcon
						width={18}
						height={18}
						className='text-secondary'
						style={iconStyle}
						onClick={toggleEditingState}
					/>
					{isShow ? (
						<EyeSlashIcon
							width={18}
							height={18}
							className='text-primary-emphasis'
							style={iconStyle}
							onClick={() => setShow(!isShow)}
						/>
					) : (
						<EyeIcon
							width={18}
							height={18}
							className='text-primary-emphasis'
							style={iconStyle}
							onClick={() => setShow(!isShow)}
						/>
					)}
				</div>
			)}
		</div>
	);
}

export default APITokenDisplay;
