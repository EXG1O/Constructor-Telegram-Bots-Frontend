import React, { memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { reverse } from 'routes';

import Dropdown, { DropdownProps } from 'react-bootstrap/Dropdown';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import { createMessageToast } from 'components/ToastContainer';

import { UserAPI } from 'services/api/users/main';
import { User } from 'services/api/users/types';

export interface UserMenuDropdownProps extends Omit<DropdownProps, 'children'> {
	user: User;
}

function UserMenuDropdown({
	user,
	...props
}: UserMenuDropdownProps): ReactElement<UserMenuDropdownProps> {
	const { t, i18n } = useTranslation('root', { keyPrefix: 'userMenuDropdown' });

	const navigate = useNavigate();

	const setShowLogoutModal = useAskConfirmModalStore((state) => state.setShow);
	const hideLogoutModal = useAskConfirmModalStore((state) => state.setHide);
	const setLoadingLogoutModal = useAskConfirmModalStore((state) => state.setLoading);

	const showLogoutModal = useCallback(
		() =>
			setShowLogoutModal({
				title: t('logoutModal.title'),
				text: t('logoutModal.text'),
				onConfirm: async () => {
					setLoadingLogoutModal(true);

					const response = await UserAPI.logout();

					if (response.ok) {
						hideLogoutModal();
						navigate(reverse('home'));
						createMessageToast({
							message: t('messages.logout.success'),
							level: 'success',
						});
					} else {
						createMessageToast({
							message: t('messages.logout.error'),
							level: 'error',
						});
					}

					setLoadingLogoutModal(false);
				},
				onCancel: null,
			}),
		[i18n.language],
	);

	return (
		<Dropdown {...props}>
			<Dropdown.Toggle
				variant='dark'
				className='text-truncate'
				style={{ maxWidth: '150px' }}
			>
				{user.first_name}
			</Dropdown.Toggle>
			<Dropdown.Menu>
				{user.is_staff && (
					<Dropdown.Item href='/admin/'>{t('adminPanel')}</Dropdown.Item>
				)}
				<Dropdown.Item as={Link} to={reverse('telegram-bots')}>
					{t('telegramBots')}
				</Dropdown.Item>
				<Dropdown.Divider />
				<Dropdown.Item as='button' onClick={showLogoutModal}>
					{t('exit')}
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
}

export default memo(UserMenuDropdown);
