import React, {
	CSSProperties,
	HTMLAttributes,
	memo,
	ReactElement,
	SVGProps,
	useCallback,
	useMemo,
} from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import { createMessageToast } from 'components/ToastContainer';

import useUsersStore from '../../../hooks/useUsersStore';

import BanIcon from 'assets/icons/ban.svg';
import BanFillIcon from 'assets/icons/ban-fill.svg';
import KeyIcon from 'assets/icons/key.svg';
import KeyFillIcon from 'assets/icons/key-fill.svg';
import TrashIcon from 'assets/icons/trash.svg';

import { makeRequest } from 'services/api/base';
import { UserAPI } from 'services/api/telegram_bots/main';
import { User } from 'services/api/telegram_bots/types';

export interface TableRowProps
	extends Omit<HTMLAttributes<HTMLTableRowElement>, 'children'> {
	user: User;
}

const iconStyle: CSSProperties = { cursor: 'pointer' };
const trashIconStyle: CSSProperties = { ...iconStyle, marginLeft: '5.5px' };

const iconProps: SVGProps<SVGSVGElement> = {
	width: 18,
	height: '100%',
	style: iconStyle,
};

function TableRow({ user, ...props }: TableRowProps): ReactElement<TableRowProps> {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;

	const updateUsers = useUsersStore((state) => state.updateUsers);

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

	const AllowedIcon = useMemo(
		() => (user.is_allowed ? KeyFillIcon : KeyIcon),
		[user],
	);
	const BlockIcon = useMemo(() => (user.is_blocked ? BanFillIcon : BanIcon), [user]);

	return (
		<tr {...props}>
			<td className='text-success-emphasis'>{`[${user.activated_date}]`}</td>
			<td className='text-primary-emphasis'>{user.telegram_id}</td>
			<td className='w-100'>{user.full_name}</td>
			<td>
				<div className='d-flex'>
					<div className='d-flex gap-2'>
						{telegramBot.is_private && (
							<AllowedIcon
								{...iconProps}
								className='text-warning'
								onClick={
									user.is_allowed ? showDisallowModal : showAllowModal
								}
							/>
						)}
						<BlockIcon
							{...iconProps}
							className='text-danger'
							onClick={
								user.is_blocked ? showUnblockModal : showBlockModal
							}
						/>
					</div>
					<TrashIcon
						{...iconProps}
						className='text-danger'
						style={trashIconStyle}
						onClick={showDeleteModal}
					/>
				</div>
			</td>
		</tr>
	);
}

export default memo(TableRow);
