import React, { ReactElement, memo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';

import Dropdown, { DropdownProps } from 'react-bootstrap/Dropdown';

import AskConfirmModal from 'components/AskConfirmModal';

import useToast from 'services/hooks/useToast';

import { UserAPI } from 'services/api/users/main';
import { User } from 'services/api/users/types';

export interface UserMenuDropdownProps extends Omit<DropdownProps, 'children'> {
	user: User;
}

function UserMenuDropdown({ user, ...props }: UserMenuDropdownProps): ReactElement<UserMenuDropdownProps> {
	const navigate = useNavigate();

	const { createMessageToast } = useToast();

	const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
	const [loadingLogoutModal, setLoadingLogoutModal] = useState<boolean>(false);

	const handleConfirmLogout = useCallback(async () => {
		setLoadingLogoutModal(true);

		const response = await UserAPI.logout();

		if (response.ok) {
			setShowLogoutModal(false);
			navigate('/');
			createMessageToast({
				message: gettext('Вы успешно вышли из аккаунта.'),
				level: 'success',
			});
		} else {
			createMessageToast({
				message: gettext('Не удалось выйти из аккаунта!'),
				level: 'error',
			});
		}

		setLoadingLogoutModal(false);
	}, []);

	return (
		<>
			<AskConfirmModal
				show={showLogoutModal}
				loading={loadingLogoutModal}
				title={gettext('Выход из аккаунта')}
				onConfirm={handleConfirmLogout}
				onHide={useCallback(() => setShowLogoutModal(false), [])}
			>
				{gettext('Вы точно хотите выйти из аккаунта?')}
			</AskConfirmModal>
			<Dropdown {...props}>
				<Dropdown.Toggle
					bsPrefix=' '
					variant='light'
					style={{ minWidth: '125px' }}
				>
					{user.first_name}
				</Dropdown.Toggle>
				<Dropdown.Menu>
					{user.is_staff && (
						<Dropdown.Item href='/admin/'>
							{gettext('Админ панель')}
						</Dropdown.Item>
					)}
					<Dropdown.Item onClick={() => navigate('/personal-cabinet/')}>
						{gettext('Личный кабинет')}
					</Dropdown.Item>
					<Dropdown.Item>
						{gettext('Настройки')}
					</Dropdown.Item>
					<Dropdown.Divider />
					<Dropdown.Item
						as='button'
						onClick={() => setShowLogoutModal(true)}
					>
						{gettext('Выйти')}
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</>
	);
}

export default memo(UserMenuDropdown);