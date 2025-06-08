import React, { memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { reverse, RouteID } from 'routes';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import Dropdown, { DropdownProps } from 'components/ui/Dropdown';
import { createMessageToast } from 'components/ui/ToastContainer';

import { UserAPI } from 'api/users/main';
import { User } from 'api/users/types';
import Button from 'components/ui/Button';

export interface UserMenuDropdownProps extends Omit<DropdownProps, 'children'> {
  user: User;
}

function UserMenuDropdown({
  user,
  ...props
}: UserMenuDropdownProps): ReactElement<UserMenuDropdownProps> {
  const { t, i18n } = useTranslation(RouteID.Root, { keyPrefix: 'userMenuDropdown' });

  const navigate = useNavigate();

  const setShowConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore(
    (state) => state.setLoading,
  );

  const showLogoutModal = useCallback(
    () =>
      setShowConfirmModal({
        title: t('logoutModal.title'),
        text: t('logoutModal.text'),
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
      }),
    [i18n.language],
  );

  return (
    <Dropdown {...props}>
      <Dropdown.Trigger asChild>
        <Button variant='dark' className='max-w-[150px]'>
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
        <Dropdown.Menu.Item onSelect={showLogoutModal}>
          {t('exit')}
        </Dropdown.Menu.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default memo(UserMenuDropdown);
