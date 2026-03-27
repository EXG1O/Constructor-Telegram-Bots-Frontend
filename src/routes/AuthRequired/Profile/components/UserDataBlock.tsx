import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import formatDate from 'i18n/formatDate';

import { RouteID } from 'routes';
import useRootRouteLoaderData from 'routes/Root/hooks/useRootRouteLoaderData';

import Block, { type BlockProps } from 'components/ui/Block';
import Table from 'components/ui/Table';

import cn from 'utils/cn';

export interface UserDataBlockProps extends Omit<
  BlockProps,
  'size' | 'variant' | 'children'
> {}

function UserDataBlock({ className, ...props }: UserDataBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.Profile, { keyPrefix: 'userDataBlock' });

  const user = useRootRouteLoaderData().user!;

  return (
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-2', className)}
    >
      <Block.Title>
        <h3 className='text-3xl font-semibold'>{t('title')}</h3>
      </Block.Title>
      <div className='w-full overflow-hidden rounded-md'>
        <Table striped>
          <Table.Body>
            <Table.Row>
              <Table.Head scope='row'>ID:</Table.Head>
              <Table.Cell>{user.id}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Head scope='row'>Telegram ID:</Table.Head>
              <Table.Cell>{user.telegram_id}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Head scope='row'>{t('table.headers.firstName')}</Table.Head>
              <Table.Cell>{user.first_name}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Head scope='row'>{t('table.headers.lastName')}</Table.Head>
              <Table.Cell>{user.last_name || '-'}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Head scope='row'>{t('table.headers.joinedDate')}</Table.Head>
              <Table.Cell>{formatDate(user.joined_date)}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </Block>
  );
}

export default UserDataBlock;
