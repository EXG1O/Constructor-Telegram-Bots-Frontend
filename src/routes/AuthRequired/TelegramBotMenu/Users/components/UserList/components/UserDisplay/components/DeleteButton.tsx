import React, { ReactElement, HTMLAttributes, memo, useState, useCallback } from 'react'
import { useRouteLoaderData } from 'react-router-dom';
import classNames from 'classnames';

import AskConfirmModal from 'components/AskConfirmModal';

import useToast from 'services/hooks/useToast';
import useUsers from '../../../../../hooks/useUsers';
import useUser from '../../../hooks/useUser';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import { UserAPI } from 'services/api/telegram_bots/main';

export type DeleteButtonProps = Omit<HTMLAttributes<HTMLElement>, 'children'>;

function DeleteButton({ className, style, onClick, ...props }: DeleteButtonProps): ReactElement<DeleteButtonProps> {
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;

	const { createMessageToast } = useToast();
	const { updateUsers } = useUsers();
	const { user } = useUser();

	const [showModal, setShowModal] = useState<boolean>(false);
	const [loadingModal, setLoadingModal] = useState<boolean>(false);

	function handleClick(event: React.MouseEvent<HTMLElement>): void {
		setShowModal(true);
		onClick?.(event);
	}

	const handleConfirm = useCallback(async () => {
		setLoadingModal(true);

		const response = await UserAPI._delete(telegramBot.id, user.id);

		if (response.ok) {
			updateUsers();
			setShowModal(false);
			createMessageToast({
				message: gettext('Вы успешно удалили пользователя.'),
				level: 'success',
			});
		} else {
			createMessageToast({
				message: gettext('Не удалось удалить пользователя!'),
				level: 'error',
			});
		}

		setLoadingModal(false);
	}, []);

	return (
		<>
			<AskConfirmModal
				show={showModal}
				loading={loadingModal}
				title={gettext('Удаление пользователя')}
				onConfirm={handleConfirm}
				onHide={useCallback(() => setShowModal(false), [])}
			>
				{gettext('Вы точно хотите удалить пользователя?')}
			</AskConfirmModal>
			<i
				{...props}
				className={classNames('d-flex bi bi-trash text-danger', className)}
				style={{ fontSize: '18px', cursor: 'pointer', ...style }}
				onClick={handleClick}
			/>
		</>
	);
}

export default memo(DeleteButton);