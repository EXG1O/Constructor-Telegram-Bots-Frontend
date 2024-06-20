import React, {
	ReactElement,
	HTMLAttributes,
	CSSProperties,
	memo,
	useCallback,
} from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import classNames from 'classnames';

import { createMessageToast } from 'components/ToastContainer';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';

import useUser from '../hooks/useUser';
import useUsers from '../../../hooks/useUsers';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import { makeRequest } from 'services/api/base';

import { UserAPI } from 'services/api/telegram_bots/main';

export type UserDisplayProps = Omit<HTMLAttributes<HTMLTableRowElement>, 'children'>;

const buttonStyle: CSSProperties = { fontSize: '18px', cursor: 'pointer' };
const deleteButtonStyle: CSSProperties = { ...buttonStyle, marginLeft: '5.5px' };

function UserDisplay(props: UserDisplayProps): ReactElement<UserDisplayProps> {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;

	const { updateUsers } = useUsers();
	const { user } = useUser();

	const setShowAskConfirmModal = useAskConfirmModalStore((state) => state.setShow);
	const hideAskConfirmModal = useAskConfirmModalStore((state) => state.setHide);
	const setLoadingAskConfirmModal = useAskConfirmModalStore(
		(state) => state.setLoading,
	);

	const showAskConfirmModal = useCallback(
		(
			title: string,
			text: string,
			apiCall: () => ReturnType<typeof makeRequest>,
			successMessage: string,
			errorMessage: string,
		) =>
			setShowAskConfirmModal({
				title,
				text,
				onConfirm: async () => {
					setLoadingAskConfirmModal(true);

					const response = await apiCall();

					if (response.ok) {
						updateUsers();
						hideAskConfirmModal();
						createMessageToast({
							message: successMessage,
							level: 'success',
						});
					} else {
						createMessageToast({
							message: errorMessage,
							level: 'error',
						});
					}

					setLoadingAskConfirmModal(false);
				},
				onCancel: null,
			}),
		[],
	);

	const showAllowModal = useCallback(
		() =>
			showAskConfirmModal(
				gettext('Разрешение пользователя'),
				gettext('Вы точно хотите разрешить пользователя?'),
				() =>
					UserAPI.partialUpdate(telegramBot.id, user.id, {
						is_allowed: true,
					}),
				gettext('Вы успешно разрешили пользователя.'),
				gettext('Не удалось разрешить пользователя.'),
			),
		[],
	);

	const showDisallowModal = useCallback(
		() =>
			showAskConfirmModal(
				gettext('Запрещение пользователя'),
				gettext('Вы точно хотите запретить пользователя?'),
				() =>
					UserAPI.partialUpdate(telegramBot.id, user.id, {
						is_allowed: false,
					}),
				gettext('Вы успешно запретили пользователя.'),
				gettext('Не удалось запретить пользователя.'),
			),
		[],
	);

	const showBlockModal = useCallback(
		() =>
			showAskConfirmModal(
				gettext('Блокирование пользователя'),
				gettext('Вы точно хотите заблокировать пользователя?'),
				() =>
					UserAPI.partialUpdate(telegramBot.id, user.id, {
						is_blocked: true,
					}),
				gettext('Вы успешно заблокировали пользователя.'),
				gettext('Не удалось заблокировать пользователя.'),
			),
		[],
	);

	const showUnblockModal = useCallback(
		() =>
			showAskConfirmModal(
				gettext('Разблокирование пользователя'),
				gettext('Вы точно хотите разблокировать пользователя?'),
				() =>
					UserAPI.partialUpdate(telegramBot.id, user.id, {
						is_blocked: false,
					}),
				gettext('Вы успешно разблокировали пользователя.'),
				gettext('Не удалось разблокировать пользователя.'),
			),
		[],
	);

	const showDeleteModal = useCallback(
		() =>
			showAskConfirmModal(
				gettext('Удаление пользователя'),
				gettext('Вы точно хотите удалить пользователя?'),
				() => UserAPI._delete(telegramBot.id, user.id),
				gettext('Вы успешно удалили пользователя.'),
				gettext('Не удалось удалить пользователя.'),
			),
		[],
	);

	return (
		<tr {...props}>
			<td className='text-success-emphasis'>{`[${user.activated_date}]`}</td>
			<td className='text-primary-emphasis'>{user.telegram_id}</td>
			<td className='w-100'>{user.full_name}</td>
			<td>
				<div className='d-flex'>
					<div className='d-flex gap-2'>
						{telegramBot.is_private && (
							<i
								className={classNames('d-flex bi text-warning', {
									'bi-key-fill': user.is_allowed,
									'bi-key': !user.is_allowed,
								})}
								style={buttonStyle}
								onClick={
									user.is_allowed ? showDisallowModal : showAllowModal
								}
							/>
						)}
						<i
							className={classNames('d-flex bi text-danger', {
								'bi-ban-fill': user.is_blocked,
								'bi-ban': !user.is_blocked,
							})}
							style={buttonStyle}
							onClick={
								user.is_blocked ? showUnblockModal : showBlockModal
							}
						/>
					</div>
					<i
						className='d-flex bi bi-trash text-danger'
						style={deleteButtonStyle}
						onClick={showDeleteModal}
					/>
				</div>
			</td>
		</tr>
	);
}

export default memo(UserDisplay);
