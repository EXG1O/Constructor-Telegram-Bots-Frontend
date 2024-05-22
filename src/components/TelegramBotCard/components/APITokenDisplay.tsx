import React, {
	ReactElement,
	HTMLAttributes,
	CSSProperties,
	useMemo,
	useEffect,
	useState,
} from 'react';
import classNames from 'classnames';

import Input from 'react-bootstrap/FormControl';

import useToast from 'services/hooks/useToast';
import useTelegramBot from '../hooks/useTelegramBot';

import { TelegramBotAPI } from 'services/api/telegram_bots/main';

export type APITokenDisplayProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

const baseIconButtonStyle: CSSProperties = { cursor: 'pointer' };
const defaultIconButtonStyle: CSSProperties = {
	...baseIconButtonStyle,
	fontSize: '18px',
};
const bigIconButtonStyle: CSSProperties = {
	...baseIconButtonStyle,
	fontSize: '28px',
};

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
					<i
						className='d-flex bi bi-check text-success'
						style={bigIconButtonStyle}
						onClick={handleSave}
					/>
					<i
						className='d-flex bi bi-x text-danger'
						style={{
							...bigIconButtonStyle,
							WebkitTextStroke: '0.4px',
						}}
						onClick={toggleEditingState}
					/>
				</div>
			) : (
				<>
					<i
						className='d-flex bi bi-pencil-square text-secondary'
						style={defaultIconButtonStyle}
						onClick={toggleEditingState}
					/>
					<i
						className={classNames('d-flex bi text-primary-emphasis', {
							'bi-eye': !isShow,
							'bi-eye-slash': isShow,
						})}
						style={defaultIconButtonStyle}
						onClick={() => setShow(!isShow)}
					/>
				</>
			)}
		</div>
	);
}

export default APITokenDisplay;
