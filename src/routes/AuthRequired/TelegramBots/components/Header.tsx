import React, {
	HTMLAttributes,
	memo,
	ReactElement,
	useCallback,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import AddButton from 'components/AddButton';

import TelegramBotAdditionModal from './TelegramBotAdditionModal';

export type HeaderProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function Header({ className, ...props }: HeaderProps): ReactElement<HeaderProps> {
	const { t } = useTranslation('telegram-bots', { keyPrefix: 'header' });

	const [showModal, setShowModal] = useState<boolean>(false);

	return (
		<>
			<TelegramBotAdditionModal
				show={showModal}
				onHide={useCallback(() => setShowModal(false), [])}
			/>
			<div
				{...props}
				className={classNames(
					'd-flex flex-wrap justify-content-between gap-2',
					className,
				)}
			>
				<h1 className='flex-grow-1 flex-lg-grow-0 fw-semibold text-center mb-0'>
					{t('title')}
				</h1>
				<AddButton
					variant='dark'
					className='flex-grow-1 flex-lg-grow-0 align-self-center'
					onClick={useCallback(() => setShowModal(true), [])}
				>
					{t('addTelegramBotButton')}
				</AddButton>
			</div>
		</>
	);
}

export default memo(Header);
