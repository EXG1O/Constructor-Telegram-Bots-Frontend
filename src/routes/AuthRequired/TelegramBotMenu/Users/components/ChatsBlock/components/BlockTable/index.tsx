import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Spinner from 'components/ui/Spinner';
import Table, { type TableProps } from 'components/ui/Table';

import ChatTableRow from './components/ChatTableRow';

import cn from 'utils/cn';

import { useChatsBlockStore } from '../../store';

export interface BlockTableProps extends Omit<TableProps, 'striped' | 'children'> {}

function BlockTable({
  className,
  ...props
}: BlockTableProps): ReactElement<BlockTableProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuUsers, {
    keyPrefix: 'chatsBlock.table',
  });

  const search = useChatsBlockStore((state) => state.search);
  const mode = useChatsBlockStore((state) => state.mode);
  const type = useChatsBlockStore((state) => state.type);
  const chats = useChatsBlockStore((state) => state.chats);
  const loading = useChatsBlockStore((state) => state.loading);

  return (
    <div className='overflow-hidden rounded-sm'>
      <Table {...props} striped className={cn('align-middle', className)}>
        {!loading ? (
          chats.length ? (
            <>
              <Table.Header className='text-nowrap'>
                <Table.Head>Telegram ID</Table.Head>
                <Table.Head>{t('headers.title')}</Table.Head>
                <Table.Head>@username</Table.Head>
                <Table.Head>{t('headers.firstName')}</Table.Head>
                <Table.Head>{t('headers.lastName')}</Table.Head>
                <Table.Head>{t('headers.forum')}</Table.Head>
                <Table.Head>{t('headers.comments')}</Table.Head>
              </Table.Header>
              <Table.Body>
                {chats.map((chat) => (
                  <ChatTableRow key={chat.id} chat={chat} />
                ))}
              </Table.Body>
            </>
          ) : (
            <Table.Body>
              <Table.Row>
                <Table.Cell className='text-center'>
                  {search
                    ? t('placeholders.notFound')
                    : mode === 'allowed'
                      ? t('placeholders.notAllowed')
                      : mode === 'blocked'
                        ? t('placeholders.notBlocked')
                        : type === 'private'
                          ? t('placeholders.notPrivate')
                          : type === 'group'
                            ? t('placeholders.notGroups')
                            : type === 'supergroup'
                              ? t('placeholders.notSupergroups')
                              : type === 'channel'
                                ? t('placeholders.notChannels')
                                : t('placeholders.notChats')}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          )
        ) : (
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <div className='flex w-full justify-center'>
                  <Spinner size='sm' />
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        )}
      </Table>
    </div>
  );
}

export default BlockTable;
