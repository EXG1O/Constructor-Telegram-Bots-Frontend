import React, { ReactElement, memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { reverse } from 'routes';

import Dropdown, { DropdownProps } from 'react-bootstrap/Dropdown';

import useToast from 'services/hooks/useToast';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';

import { UserAPI } from 'services/api/users/main';
import { User } from 'services/api/users/types';

export interface UserMenuDropdownProps extends Omit<DropdownProps, 'children'> {
	user: User;
}

function UserMenuDropdown({
	user,
	...props
}: UserMenuDropdownProps): ReactElement<UserMenuDropdownProps> {
	const navigate = useNavigate();

	const { createMessageToast } = useToast();

	const setShowLogoutModal = useAskConfirmModalStore((state) => state.setShow);
	const hideLogoutModal = useAskConfirmModalStore((state) => state.setHide);
	const setLoadingLogoutModal = useAskConfirmModalStore((state) => state.setLoading);

	const showLogoutModal = useCallback(
		() =>
			setShowLogoutModal({
				title: gettext('Выход из аккаунта'),
				text: gettext('Вы точно хотите выйти из аккаунта?'),
				onConfirm: async () => {
					setLoadingLogoutModal(true);

					const response = await UserAPI.logout();

					if (response.ok) {
						hideLogoutModal();
						navigate(reverse('home'));
						createMessageToast({
							message: gettext('Вы успешно вышли из аккаунта.'),
							level: 'success',
						});
					} else {
						createMessageToast({
							message: gettext('Не удалось выйти из аккаунта.'),
							level: 'error',
						});
					}

					setLoadingLogoutModal(false);
				},
				onCancel: null,
			}),
		[],
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
					<Dropdown.Item href='/admin/'>
						{gettext('Админ панель')}
					</Dropdown.Item>
				)}
				<Dropdown.Item as={Link} to={reverse('telegram-bots')}>
					{gettext('Telegram боты')}
				</Dropdown.Item>
				<Dropdown.Divider />
				<Dropdown.Item as='button' onClick={showLogoutModal}>
					{gettext('Выйти')}
				</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
}

export default memo(UserMenuDropdown);
