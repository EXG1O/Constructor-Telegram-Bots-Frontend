import React, { HTMLAttributes, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import formatDate from 'i18n/formatDate';
import { Shield, ShieldBan, Trash2, UserCheck, UserX } from 'lucide-react';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import IconButton from 'components/ui/IconButton';
import Table from 'components/ui/Table';
import { createMessageToast } from 'components/ui/ToastContainer';

import useUsersStore from '../../../hooks/useUsersStore';

import { makeRequest } from 'api/core';
import { UserAPI } from 'api/telegram_bots/user';
import { User } from 'api/telegram_bots/user/types';

import cn from 'utils/cn';

export interface TableRowProps
  extends Omit<HTMLAttributes<HTMLTableRowElement>, 'children'> {
  user: User;
}

function TableRow({ user, className, ...props }: TableRowProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuUsers, {
    keyPrefix: 'table.row',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const updateUsers = useUsersStore((state) => state.updateUsers);

  const showBaseConfirmModal = useConfirmModalStore((state) => state.setShow);
  const hideConfirmModal = useConfirmModalStore((state) => state.setHide);
  const setLoadingConfirmModal = useConfirmModalStore((state) => state.setLoading);

  function showConfirmModal(
    title: string,
    text: string,
    apiCall: () => ReturnType<typeof makeRequest>,
    successMessage: string,
    errorMessage: string,
  ): void {
    showBaseConfirmModal({
      title,
      text,
      onConfirm: async () => {
        setLoadingConfirmModal(true);

        const response = await apiCall();

        if (response.ok) {
          updateUsers();
          hideConfirmModal();
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

        setLoadingConfirmModal(false);
      },
      onCancel: null,
    });
  }

  function handleAllowClick(): void {
    showConfirmModal(
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

  function handleDisallowClick(): void {
    showConfirmModal(
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

  function handleBlockClick(): void {
    showConfirmModal(
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

  function handleUnblockClick(): void {
    showConfirmModal(
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

  function handleDeleteClick(): void {
    showConfirmModal(
      t('deleteModal.title'),
      t('deleteModal.text'),
      () => UserAPI.delete(telegramBot.id, user.id),
      t('messages.deleteUser.success'),
      t('messages.deleteUser.error'),
    );
  }

  return (
    <Table.Row {...props} className={cn('text-nowrap', className)}>
      <Table.Cell className='text-success-emphasis'>{`[${formatDate(user.activated_date)}]`}</Table.Cell>
      <Table.Cell className='text-primary-emphasis'>{user.telegram_id}</Table.Cell>
      <Table.Cell className='w-full'>{user.full_name}</Table.Cell>
      <Table.Cell>
        <div className='flex gap-1'>
          {telegramBot.is_private &&
            (user.is_allowed ? (
              <IconButton
                size='sm'
                className='text-success'
                onClick={handleDisallowClick}
              >
                <UserCheck />
              </IconButton>
            ) : (
              <IconButton size='sm' className='text-danger' onClick={handleAllowClick}>
                <UserX />
              </IconButton>
            ))}
          {user.is_blocked ? (
            <IconButton size='sm' className='text-danger' onClick={handleUnblockClick}>
              <ShieldBan />
            </IconButton>
          ) : (
            <IconButton size='sm' className='text-success' onClick={handleBlockClick}>
              <Shield />
            </IconButton>
          )}
          <IconButton size='sm' className='text-danger' onClick={handleDeleteClick}>
            <Trash2 />
          </IconButton>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}

export default TableRow;
