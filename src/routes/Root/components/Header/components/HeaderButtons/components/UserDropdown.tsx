import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LocalStorageKey } from 'enums/storage';

import { RouteID } from 'routes';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import Button from 'components/ui/Button';
import Dropdown, { type DropdownProps } from 'components/ui/Dropdown';
import { createMessageToast } from 'components/ui/ToastContainer';

import { type User, UsersService } from 'api';

import reverse from 'utils/reverse';

export interface UserDropdownProps extends Omit<DropdownProps, 'children'> {
  user: User;
}

function UserDropdown({ user, ...props }: UserDropdownProps): ReactElement {
  const { t, i18n } = useTranslation<`${RouteID.Root}`, any>('root', {
    keyPrefix: 'header.userDropdown',
  });

  const location = useLocation();
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

        const { error } = await UsersService.postUserLogout();

        if (error) {
          setLoadingConfirmModal(false);
          createMessageToast({
            message: t('messages.logout.error'),
            level: 'error',
          });
          return;
        }

        window.localStorage.removeItem(LocalStorageKey.RefreshToken);
        window.localStorage.removeItem(LocalStorageKey.AccessToken);

        hideConfirmModal();
        navigate(reverse(RouteID.Home));
        createMessageToast({
          message: t('messages.logout.success'),
          level: 'success',
        });
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
          <>
            <Dropdown.Menu.Item asChild>
              <a href={`/${i18n.language}/admin/`}>{t('adminPanel')}</a>
            </Dropdown.Menu.Item>
            <Dropdown.Menu.Separator />
          </>
        )}
        <Dropdown.Menu.Item asChild>
          <Link to={reverse(RouteID.Profile, { location })}>{t('profile')}</Link>
        </Dropdown.Menu.Item>
        <Dropdown.Menu.Item asChild>
          <Link to={reverse(RouteID.TelegramBots, { location })}>
            {t('telegramBots')}
          </Link>
        </Dropdown.Menu.Item>
        <Dropdown.Menu.Separator />
        <Dropdown.Menu.Item onSelect={handleLogoutClick}>
          {t('exit')}
        </Dropdown.Menu.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default UserDropdown;
