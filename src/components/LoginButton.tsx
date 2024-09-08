import React, { memo, ReactElement, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button, { ButtonProps } from 'react-bootstrap/Button';

import LoginModal from './LoginModal';

import TelegramIcon from 'assets/icons/telegram.svg';

export type LoginButtonProps = Omit<ButtonProps, 'as' | 'href' | 'target' | 'children'>;

function LoginButton({
	onClick,
	...props
}: LoginButtonProps): ReactElement<LoginButtonProps> {
	const { t } = useTranslation('components', { keyPrefix: 'loginButton' });

	const [showModal, setShowModal] = useState<boolean>(false);

	function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
		setShowModal(true);
		onClick?.(event);
	}

	return (
		<>
			<LoginModal
				show={showModal}
				onHide={useCallback(() => setShowModal(false), [])}
			/>
			<Button
				{...props}
				as='a'
				href={`tg://resolve?domain=${process.env.TELEGRAM_BOT_USERNAME}&start=login`}
				className='d-flex align-items-center gap-2'
				onClick={handleClick}
			>
				<TelegramIcon />
				{t('text')}
			</Button>
		</>
	);
}

export default memo(LoginButton);
