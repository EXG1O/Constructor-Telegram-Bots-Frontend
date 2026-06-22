import React, { type ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block, { type BlockProps } from 'components/ui/Block';

import BlockFooter from './components/BlockFooter';
import BlockTable from './components/BlockTable';
import BlockToolbar from './components/BlockToolbar';

import useTelegramBotMenuChatsRouteLoaderData from '../../hooks/useTelegramBotMenuChatsRouteLoaderData';

import cn from 'utils/cn';

import { type StoreProps, UsersBlockStoreProvider } from './store';

export interface UsersBlockProps extends Omit<BlockProps, 'variant' | 'children'> {}

function UsersBlock({ className, ...props }: UsersBlockProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuUsers, {
    keyPrefix: 'usersBlock',
  });

  const { userPagination } = useTelegramBotMenuChatsRouteLoaderData();
  const { count, limit, offset, results } = userPagination;

  const storeProps = useMemo<StoreProps>(
    () => ({
      count,
      limit,
      offset,
      search: null,
      mode: 'all',
      users: results,
      loading: false,
    }),
    [count, limit, offset, results],
  );

  return (
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-2', className)}
    >
      <Block.Title>
        <h3 className='text-3xl font-semibold'>{t('title')}</h3>
      </Block.Title>
      <UsersBlockStoreProvider storeProps={storeProps}>
        <BlockToolbar />
        <BlockTable />
        <BlockFooter />
      </UsersBlockStoreProvider>
    </Block>
  );
}

export default UsersBlock;
