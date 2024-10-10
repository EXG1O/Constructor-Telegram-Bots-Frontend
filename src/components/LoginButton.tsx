import React, { memo, ReactElement, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import { reverse } from 'routes';

import Button, { ButtonProps } from 'react-bootstrap/Button';

import Loading from './Loading';
import { createMessageToast } from './ToastContainer';

import TelegramIcon from 'assets/icons/telegram.svg';

import { UsersAPI } from 'services/api/users/main';
import { Data } from 'services/api/users/types';

type AuthData = Data.UsersAPI.Login;

declare global {
	interface Window {
		Telegram: {
			Login: {
				init: (
					options?: Record<string, any>,
					callback?: (authData: AuthData) => void,
				) => void;
				open: () => void;
			};
		};
	}
}

export type LoginButtonProps = Omit<ButtonProps, 'children'>;

function LoginButton({
	className,
	...props
}: LoginButtonProps): ReactElement<LoginButtonProps> {
	const { t } = useTranslation('components', { keyPrefix: 'loginButton' });

	const navigate = useNavigate();

	const [loading, setLoading] = useState<boolean>(true);

	const buttonRef = useRef<HTMLButtonElement | null>(null);

	async function login(authData: AuthData): Promise<void> {
		setLoading(true);

		const response = await UsersAPI.login(authData);

		if (!response.ok) {
			createMessageToast({
				message: t('messages.userLogin.error'),
				level: 'error',
			});
			setLoading(false);
			return;
		}

		createMessageToast({
			message: t('messages.userLogin.success'),
			level: 'success',
		});
		navigate(reverse('telegram-bots'));
	}

	useEffect(() => {
		const createScript = (): void => {
			if (buttonRef.current) {
				if (process.env.ENABLE_TELEGRAM_AUTH === 'true') {
					const script = document.createElement('script');
					script.src = `https://telegram.org/js/telegram-widget.js?22`;
					script.onload = () => {
						window.Telegram.Login.init(
							{
								bot_id: process.env.TELEGRAM_BOT_ID,
								request_access: 'write',
							},
							login,
						);
						buttonRef.current!.onclick = () => window.Telegram.Login.open();
						setLoading(false);
					};
					buttonRef.current.appendChild(script);
				} else {
					buttonRef.current.onclick = () =>
						login({
							id: 1,
							first_name: 'Anonymous',
							auth_date: 0,
							hash: '*'.repeat(64),
						});
					setLoading(false);
				}
			} else {
				setTimeout(createScript, 500);
			}
		};

		createScript();
	}, []);

	return (
		<Button
			{...props}
			ref={buttonRef}
			disabled={loading}
			className={classNames(className, 'd-flex align-items-center', {
				'gap-2': !loading,
			})}
		>
			{!loading ? (
				<>
					<TelegramIcon />
					{t('text')}
				</>
			) : (
				<Loading size='xxs' />
			)}
		</Button>
	);
}

export default memo(LoginButton);
