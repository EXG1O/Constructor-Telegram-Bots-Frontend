import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Spinner from 'components/ui/Spinner';
import Table, { type TableProps } from 'components/ui/Table';

import TableRow from './components/TableRow';

import useUsersStore from '../../hooks/useUsersStore';

import cn from 'utils/cn';

export interface UsersTableProps extends Omit<
  TableProps,
  'size' | 'striped' | 'children'
> {}

function UsersTable({
  className,
  ...props
}: UsersTableProps): ReactElement<UsersTableProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuUsers, { keyPrefix: 'table' });

  const loading = useUsersStore((state) => state.loading);
  const search = useUsersStore((state) => state.search);
  const type = useUsersStore((state) => state.type);
  const users = useUsersStore((state) => state.users);

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
                  <TableRow key={user.id} user={user} />
                ))}
              </Table.Body>
            </>
          ) : (
            <Table.Body>
              <Table.Row>
                <Table.Cell className='text-center'>
                  {search
                    ? t('placeholders.notFound')
                    : type === 'allowed'
                      ? t('placeholders.notAllowed')
                      : type === 'blocked'
                        ? t('placeholders.notBlocked')
                        : t('placeholders.notActivated')}
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

export default UsersTable;
