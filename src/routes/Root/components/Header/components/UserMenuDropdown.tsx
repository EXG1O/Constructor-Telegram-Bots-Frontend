import React, { CSSProperties, memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { reverse, RouteID } from 'routes';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import Dropdown, { DropdownProps } from 'components/Dropdown';
import { createMessageToast } from 'components/ui/ToastContainer';

import { UserAPI } from 'api/users/main';
import { User } from 'api/users/types';

export interface UserMenuDropdownProps extends Omit<DropdownProps, 'children'> {
  user: User;
}

const toggleButtonStyle: CSSProperties = { maxWidth: '150px' };

function UserMenuDropdown({
  user,
  ...props
}: UserMenuDropdownProps): ReactElement<UserMenuDropdownProps> {
  const { t, i18n } = useTranslation(RouteID.Root, { keyPrefix: 'userMenuDropdown' });

  const navigate = useNavigate();

  const setShowAskConfirmModal = useAskConfirmModalStore((state) => state.setShow);
  const hideAskConfirmModal = useAskConfirmModalStore((state) => state.setHide);
  const setLoadingAskConfirmModal = useAskConfirmModalStore(
    (state) => state.setLoading,
  );

  const showLogoutModal = useCallback(
    () =>
      setShowAskConfirmModal({
        title: t('logoutModal.title'),
        text: t('logoutModal.text'),
        onConfirm: async () => {
          setLoadingAskConfirmModal(true);

          const response = await UserAPI.logout();

          if (response.ok) {
            hideAskConfirmModal();
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

          setLoadingAskConfirmModal(false);
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
        style={toggleButtonStyle}
      >
        {user.first_name}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {user.is_staff && (
          <Dropdown.Item href='/admin/'>{t('adminPanel')}</Dropdown.Item>
        )}
        <Dropdown.Item as={Link} to={reverse(RouteID.TelegramBots)}>
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
