import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Spinner from 'components/ui/Spinner';
import Table, { TableProps } from 'components/ui/Table';

import TableRow from './components/TableRow';

import useUsersStore from '../../hooks/useUsersStore';

import cn from 'utils/cn';

export interface UsersTableProps
  extends Omit<TableProps, 'size' | 'striped' | 'children'> {}

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
        <Table.Body>
          {!loading ? (
            users.length ? (
              users.map((user) => <TableRow key={user.id} user={user} />)
            ) : (
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
            )
          ) : (
            <Table.Row>
              <Table.Cell>
                <div className='flex w-full justify-center'>
                  <Spinner size='sm' />
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
}

export default UsersTable;
