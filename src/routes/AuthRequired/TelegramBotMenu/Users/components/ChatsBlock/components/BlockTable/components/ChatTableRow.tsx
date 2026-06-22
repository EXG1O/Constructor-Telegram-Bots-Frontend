import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Shield, ShieldBan, Trash2, UserCheck, UserX, X } from 'lucide-react';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { useConfirmModalStore } from 'components/shared/ConfirmModal/store';
import IconButton from 'components/ui/IconButton';
import Table from 'components/ui/Table';
import type { TableRowProps } from 'components/ui/Table/components/TableRow';
import { createMessageToast } from 'components/ui/ToastContainer';

import type { makeRequest } from 'api/core';
import { ChatAPI } from 'api/telegram-bots/chat';
import type { Chat } from 'api/telegram-bots/chat/types';

import cn from 'utils/cn';

import { useChatsBlockStore } from '../../../store';

export interface ChatTableRowProps extends Omit<TableRowProps, 'children'> {
  chat: Chat;
}

function ChatTableRow({ chat, className, ...props }: ChatTableRowProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuUsers, {
    keyPrefix: 'chatsBlock.table.body',
  });

  const botID = useTelegramBotStore((state) => state.telegramBot!.id);
  const botIsPrivate = useTelegramBotStore((state) => state.telegramBot!.is_private);

  const updateChats = useChatsBlockStore((state) => state.updateChats);

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

        updateChats();
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
      () => ChatAPI.partialUpdate(botID, chat.id, { is_allowed: true }),
      t('messages.allowChat.success'),
      t('messages.allowChat.error'),
    );
  }

  function handleDisallowClick(): void {
    showConfirmModal(
      t('disallowModal.title'),
      t('disallowModal.text'),
      () => ChatAPI.partialUpdate(botID, chat.id, { is_allowed: false }),
      t('messages.disallowChat.success'),
      t('messages.disallowChat.error'),
    );
  }

  function handleBlockClick(): void {
    showConfirmModal(
      t('blockModal.title'),
      t('blockModal.text'),
      () => ChatAPI.partialUpdate(botID, chat.id, { is_blocked: true }),
      t('messages.blockChat.success'),
      t('messages.blockChat.error'),
    );
  }

  function handleUnblockClick(): void {
    showConfirmModal(
      t('unblockModal.title'),
      t('unblockModal.text'),
      () => ChatAPI.partialUpdate(botID, chat.id, { is_blocked: false }),
      t('messages.unblockChat.success'),
      t('messages.unblockChat.error'),
    );
  }

  function handleDeleteClick(): void {
    showConfirmModal(
      t('deleteModal.title'),
      t('deleteModal.text'),
      () => ChatAPI.delete(botID, chat.id),
      t('messages.deleteChat.success'),
      t('messages.deleteChat.error'),
    );
  }

  return (
    <Table.Row {...props} className={cn('text-center', 'text-nowrap', className)}>
      <Table.Cell className='text-primary-emphasis'>{chat.telegram_id}</Table.Cell>
      <Table.Cell>{chat.title || '-'}</Table.Cell>
      <Table.Cell>{chat.username || '-'}</Table.Cell>
      <Table.Cell>{chat.first_name || '-'}</Table.Cell>
      <Table.Cell>{chat.last_name || '-'}</Table.Cell>
      <Table.Cell>
        <div className='flex w-full justify-center [&_svg]:size-4.5'>
          {chat.is_forum ? (
            <Check className='text-success' />
          ) : (
            <X className='text-danger' />
          )}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className='flex w-full justify-center [&_svg]:size-4.5'>
          {chat.is_direct_messages ? (
            <Check className='text-success' />
          ) : (
            <X className='text-danger' />
          )}
        </div>
      </Table.Cell>
      <Table.Cell className='w-px'>
        <div className='flex w-full gap-1'>
          {botIsPrivate &&
            (chat.is_allowed ? (
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
          {chat.is_blocked ? (
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

export default ChatTableRow;
