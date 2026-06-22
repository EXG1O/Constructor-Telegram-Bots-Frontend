import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import formatDate from 'i18n/formatDate';
import { Check, Shield, ShieldBan, Trash2, UserCheck, UserX, X } from 'lucide-react';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import IconButton from 'components/ui/IconButton';
import Table from 'components/ui/Table';
import type { TableRowProps } from 'components/ui/Table/components/TableRow';
import { createMessageToast } from 'components/ui/ToastContainer';

import type { makeRequest } from 'api/core';
import { UserAPI } from 'api/telegram-bots/user';
import type { User } from 'api/telegram-bots/user/types';

import cn from 'utils/cn';

import { useUsersBlockStore } from '../../../store';

export interface UserTableRowProps extends Omit<TableRowProps, 'children'> {
  user: User;
}

function UserTableRow({ user, className, ...props }: UserTableRowProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuUsers, {
    keyPrefix: 'usersBlock.table.body',
  });

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);
  const botIsPrivate = useTelegramBotStore((state) => state.telegramBot!.is_private);

  const updateUsers = useUsersBlockStore((state) => state.updateUsers);

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

        if (!response.ok) {
          createMessageToast({
            message: errorMessage,
            level: 'error',
          });
          setLoadingConfirmModal(false);
          return;
        }

        updateUsers();
        createMessageToast({ message: successMessage, level: 'success' });
        hideConfirmModal();
      },
      onCancel: null,
    });
  }

  function handleAllowClick(): void {
    showConfirmModal(
      t('allowModal.title'),
      t('allowModal.text'),
      () => UserAPI.partialUpdate(botID, user.id, { is_allowed: true }),
      t('messages.allowUser.success'),
      t('messages.allowUser.error'),
    );
  }

  function handleDisallowClick(): void {
    showConfirmModal(
      t('disallowModal.title'),
      t('disallowModal.text'),
      () => UserAPI.partialUpdate(botID, user.id, { is_allowed: false }),
      t('messages.disallowUser.success'),
      t('messages.disallowUser.error'),
    );
  }

  function handleBlockClick(): void {
    showConfirmModal(
      t('blockModal.title'),
      t('blockModal.text'),
      () => UserAPI.partialUpdate(botID, user.id, { is_blocked: true }),
      t('messages.blockUser.success'),
      t('messages.blockUser.error'),
    );
  }

  function handleUnblockClick(): void {
    showConfirmModal(
      t('unblockModal.title'),
      t('unblockModal.text'),
      () => UserAPI.partialUpdate(botID, user.id, { is_blocked: false }),
      t('messages.unblockUser.success'),
      t('messages.unblockUser.error'),
    );
  }

  function handleDeleteClick(): void {
    showConfirmModal(
      t('deleteModal.title'),
      t('deleteModal.text'),
      () => UserAPI.delete(botID, user.id),
      t('messages.deleteUser.success'),
      t('messages.deleteUser.error'),
    );
  }

  return (
    <Table.Row {...props} className={cn('text-center', 'text-nowrap', className)}>
      <Table.Cell className='text-success-emphasis'>{`[${formatDate(user.activated_date)}]`}</Table.Cell>
      <Table.Cell className='text-primary-emphasis'>{user.telegram_id}</Table.Cell>
      <Table.Cell>{user.username || '-'}</Table.Cell>
      <Table.Cell>{user.first_name}</Table.Cell>
      <Table.Cell>{user.last_name || '-'}</Table.Cell>
      <Table.Cell className='w-px'>
        <div className='flex w-full justify-center [&_svg]:size-4.5'>
          {user.is_bot ? (
            <Check className='text-success' />
          ) : (
            <X className='text-danger' />
          )}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className='flex w-full justify-center [&_svg]:size-4.5'>
          {user.is_premium ? (
            <Check className='text-success' />
          ) : (
            <X className='text-danger' />
          )}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className='flex w-full gap-1'>
          {botIsPrivate &&
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

export default UserTableRow;
