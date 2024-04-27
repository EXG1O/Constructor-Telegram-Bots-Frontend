import React, { ReactElement, HTMLAttributes, memo, useState, useCallback } from 'react';
import classNames from 'classnames';

import AddButton from 'components/AddButton';

import TelegramBotAdditionModal from './TelegramBotAdditionModal';

export type HeaderProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function Header({ className, ...props }: HeaderProps): ReactElement<HeaderProps> {
	const [showModal, setShowModal] = useState<boolean>(false);

	return (
		<>
			<TelegramBotAdditionModal
				show={showModal}
				onHide={useCallback(() => setShowModal(false), [])}
			/>
			<div {...props} className={classNames('d-flex flex-wrap justify-content-between gap-2', className)}>
				<h1 className='flex-grow-1 flex-lg-grow-0 fw-semibold text-center mb-0'>
					{gettext('Добавленные Telegram боты')}
				</h1>
				<AddButton
					variant='dark'
					className='flex-grow-1 flex-lg-grow-0 align-self-center'
					onClick={useCallback(() => setShowModal(true), [])}
				>
					{gettext('Добавить Telegram бота')}
				</AddButton>
			</div>
		</>
	);
}

export default memo(Header);