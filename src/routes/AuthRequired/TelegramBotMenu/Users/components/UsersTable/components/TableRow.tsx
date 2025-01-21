import React, {
  CSSProperties,
  FC,
  HTMLAttributes,
  memo,
  ReactElement,
  SVGProps,
} from 'react';
import { useTranslation } from 'react-i18next';
import formatDate from 'i18n/formatDate';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { useAskConfirmModalStore } from 'components/AskConfirmModal/store';
import { createMessageToast } from 'components/ToastContainer';

import useUsersStore from '../../../hooks/useUsersStore';

import BanIcon from 'assets/icons/ban.svg';
import BanFillIcon from 'assets/icons/ban-fill.svg';
import KeyIcon from 'assets/icons/key.svg';
import KeyFillIcon from 'assets/icons/key-fill.svg';
import TrashIcon from 'assets/icons/trash.svg';

import { makeRequest } from 'api/core';
import { UserAPI } from 'api/telegram_bots/main';
import { User } from 'api/telegram_bots/types';

export interface TableRowProps
  extends Omit<HTMLAttributes<HTMLTableRowElement>, 'children'> {
  user: User;
}

const iconProps: SVGProps<SVGSVGElement> = {
  width: 18,
  height: '100%',
  cursor: 'pointer',
};
const trashIconStyle: CSSProperties = { marginLeft: '5.5px' };

function TableRow({ user, ...props }: TableRowProps): ReactElement<TableRowProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuUsers, {
    keyPrefix: 'table.row',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const updateUsers = useUsersStore((state) => state.updateUsers);

  const setShowAskConfirmModal = useAskConfirmModalStore((state) => state.setShow);
  const hideAskConfirmModal = useAskConfirmModalStore((state) => state.setHide);
  const setLoadingAskConfirmModal = useAskConfirmModalStore(
    (state) => state.setLoading,
  );

  function showAskConfirmModal(
    title: string,
    text: string,
    apiCall: () => ReturnType<typeof makeRequest>,
    successMessage: string,
    errorMessage: string,
  ): void {
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
    });
  }

  function showAllowModal(): void {
    showAskConfirmModal(
      t('allowModal.title'),
      t('allowModal.text'),
      () =>
        UserAPI.partialUpdate(telegramBot.id, user.id, {
          is_allowed: true,
        }),
      t('messages.allowUser.success'),
      t('messages.allowUser.error'),
    );
  }

  function showDisallowModal(): void {
    showAskConfirmModal(
      t('disallowModal.title'),
      t('disallowModal.text'),
      () =>
        UserAPI.partialUpdate(telegramBot.id, user.id, {
          is_allowed: false,
        }),
      t('messages.disallowUser.success'),
      t('messages.disallowUser.error'),
    );
  }

  function showBlockModal(): void {
    showAskConfirmModal(
      t('blockModal.title'),
      t('blockModal.text'),
      () =>
        UserAPI.partialUpdate(telegramBot.id, user.id, {
          is_blocked: true,
        }),
      t('messages.blockUser.success'),
      t('messages.blockUser.error'),
    );
  }

  function showUnblockModal(): void {
    showAskConfirmModal(
      t('unblockModal.title'),
      t('unblockModal.text'),
      () =>
        UserAPI.partialUpdate(telegramBot.id, user.id, {
          is_blocked: false,
        }),
      t('messages.unblockUser.success'),
      t('messages.unblockUser.error'),
    );
  }

  function showDeleteModal(): void {
    showAskConfirmModal(
      t('deleteModal.title'),
      t('deleteModal.text'),
      () => UserAPI.delete(telegramBot.id, user.id),
      t('messages.deleteUser.success'),
      t('messages.deleteUser.error'),
    );
  }

  const AllowedIcon: FC<SVGProps<SVGSVGElement>> = user.is_allowed
    ? KeyFillIcon
    : KeyIcon;
  const BlockIcon: FC<SVGProps<SVGSVGElement>> = user.is_blocked
    ? BanFillIcon
    : BanIcon;

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
                onClick={user.is_allowed ? showDisallowModal : showAllowModal}
              />
            )}
            <BlockIcon
              {...iconProps}
              className='text-danger'
              onClick={user.is_blocked ? showUnblockModal : showBlockModal}
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
