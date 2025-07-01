import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { reverse, RouteID } from 'routes';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import Button from 'components/ui/Button';
import Dropdown, { DropdownProps } from 'components/ui/Dropdown';
import { createMessageToast } from 'components/ui/ToastContainer';

import { UserAPI } from 'api/users/main';
import { User } from 'api/users/types';

export interface HeaderUserDropdownProps extends Omit<DropdownProps, 'children'> {
  user: User;
}

function HeaderUserDropdown({ user, ...props }: HeaderUserDropdownProps): ReactElement {
  const { t } = useTranslation(RouteID.Root, { keyPrefix: 'header.userDropdown' });

  const navigate = useNavigate();

  const showConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  function handleLogoutClick(): void {
    showConfirmModal({
      title: t('logoutConfirmModal.title'),
      text: t('logoutConfirmModal.text'),
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const response = await UserAPI.logout();

        if (response.ok) {
          hideConfirmModal();
          navigate(reverse(RouteID.Home));
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

        setLoadingConfirmModal(false);
      },
      onCancel: null,
    });
  }

  return (
    <Dropdown {...props}>
      <Dropdown.Trigger asChild>
        <Button variant='dark' className='max-w-37.5'>
          <span className='truncate'>{user.first_name}</span>
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Menu>
        {user.is_staff && (
          <Dropdown.Menu.Item asChild>
            <a href='/admin/'>{t('adminPanel')}</a>
          </Dropdown.Menu.Item>
        )}
        <Dropdown.Menu.Item asChild>
          <Link to={reverse(RouteID.TelegramBots)}>{t('telegramBots')}</Link>
        </Dropdown.Menu.Item>
        <Dropdown.Menu.Separator />
        <Dropdown.Menu.Item onSelect={handleLogoutClick}>
          {t('exit')}
        </Dropdown.Menu.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default HeaderUserDropdown;
