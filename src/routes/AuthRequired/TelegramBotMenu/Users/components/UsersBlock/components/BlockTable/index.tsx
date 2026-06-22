import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Spinner from 'components/ui/Spinner';
import Table, { type TableProps } from 'components/ui/Table';

import UserTableRow from './components/UserTableRow';

import cn from 'utils/cn';

import { useUsersBlockStore } from '../../store';

export interface BlockTableProps extends Omit<TableProps, 'striped' | 'children'> {}

function BlockTable({
  className,
  ...props
}: BlockTableProps): ReactElement<BlockTableProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuUsers, {
    keyPrefix: 'usersBlock.table',
  });

  const search = useUsersBlockStore((state) => state.search);
  const mode = useUsersBlockStore((state) => state.mode);
  const users = useUsersBlockStore((state) => state.users);
  const loading = useUsersBlockStore((state) => state.loading);

  return (
    <div className='overflow-hidden rounded-sm'>
      <Table {...props} striped className={cn('align-middle', className)}>
        {!loading ? (
          users.length ? (
            <>
              <Table.Header className='text-nowrap'>
                <Table.Head>{t('headers.activatedDate')}</Table.Head>
                <Table.Head>Telegram ID</Table.Head>
                <Table.Head>@username</Table.Head>
                <Table.Head className='w-1/2'>{t('headers.firstName')}</Table.Head>
                <Table.Head className='w-1/2'>{t('headers.lastName')}</Table.Head>
                <Table.Head>{t('headers.bot')}</Table.Head>
                <Table.Head>{t('headers.premium')}</Table.Head>
              </Table.Header>
              <Table.Body>
                {users.map((user) => (
                  <UserTableRow key={user.id} user={user} />
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
