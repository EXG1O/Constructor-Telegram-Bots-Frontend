import React, {
	CSSProperties,
	HTMLAttributes,
	memo,
	ReactElement,
	SVGProps,
	useCallback,
	useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteLoaderData } from 'react-router-dom';
import formatDate from 'i18n/formatDate';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import { createMessageToast } from 'components/ToastContainer';

import useUsersStore from '../../../hooks/useUsersStore';

import BanIcon from 'assets/icons/ban.svg';
import BanFillIcon from 'assets/icons/ban-fill.svg';
import KeyIcon from 'assets/icons/key.svg';
import KeyFillIcon from 'assets/icons/key-fill.svg';
import TrashIcon from 'assets/icons/trash.svg';

import { makeRequest } from 'services/api/core';
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
	const { t, i18n } = useTranslation('telegram-bot-menu-users', {
		keyPrefix: 'table.row',
	});

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
				t('allowModal.title'),
				t('allowModal.text'),
				() =>
					UserAPI.partialUpdate(telegramBot.id, user.id, {
						is_allowed: true,
					}),
				t('messages.allowUser.success'),
				t('messages.allowUser.error'),
			),
		[i18n.language, telegramBot.id],
	);

	const showDisallowModal = useCallback(
		() =>
			showAskConfirmModal(
				t('disallowModal.title'),
				t('disallowModal.text'),
				() =>
					UserAPI.partialUpdate(telegramBot.id, user.id, {
						is_allowed: false,
					}),
				t('messages.disallowUser.success'),
				t('messages.disallowUser.error'),
			),
		[i18n.language, telegramBot.id],
	);

	const showBlockModal = useCallback(
		() =>
			showAskConfirmModal(
				t('blockModal.title'),
				t('blockModal.text'),
				() =>
					UserAPI.partialUpdate(telegramBot.id, user.id, {
						is_blocked: true,
					}),
				t('messages.blockUser.success'),
				t('messages.blockUser.error'),
			),
		[i18n.language, telegramBot.id],
	);

	const showUnblockModal = useCallback(
		() =>
			showAskConfirmModal(
				t('unblockModal.title'),
				t('unblockModal.text'),
				() =>
					UserAPI.partialUpdate(telegramBot.id, user.id, {
						is_blocked: false,
					}),
				t('messages.unblockUser.success'),
				t('messages.unblockUser.error'),
			),
		[i18n.language, telegramBot.id],
	);

	const showDeleteModal = useCallback(
		() =>
			showAskConfirmModal(
				t('deleteModal.title'),
				t('deleteModal.text'),
				() => UserAPI._delete(telegramBot.id, user.id),
				t('messages.deleteUser.success'),
				t('messages.deleteUser.error'),
			),
		[i18n.language, telegramBot.id],
	);

	const AllowedIcon = useMemo(
		() => (user.is_allowed ? KeyFillIcon : KeyIcon),
		[user],
	);
	const BlockIcon = useMemo(() => (user.is_blocked ? BanFillIcon : BanIcon), [user]);

	return (
		<tr {...props}>
			<td className='text-success-emphasis'>{`[${formatDate(user.activated_date)}]`}</td>
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
