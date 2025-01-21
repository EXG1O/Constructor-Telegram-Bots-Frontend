import React, { memo, ReactElement, ReactNode, useEffect, useMemo } from 'react';

import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import StoreContext from '../contexts/StoreContext';

import useTelegramBotMenuUsersRouteLoaderData from '../hooks/useTelegramBotMenuUsersRouteLoaderData';

import { createStore, InitialProps } from '../store';

export interface StoreProviderProps {
  children: ReactNode;
}

function StoreProvider({
  children,
}: StoreProviderProps): ReactElement<StoreProviderProps> {
  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();
  const { paginationData: initialPaginationData } =
    useTelegramBotMenuUsersRouteLoaderData();

  const paginationData = useMemo<Omit<InitialProps, 'telegramBot'>>(() => {
    const { count, limit, offset, search, type, results } = initialPaginationData;
    return { count, limit, offset, search, type, users: results };
  }, [initialPaginationData]);

  const store = useMemo(() => createStore({ telegramBot, ...paginationData }), []);

  useEffect(() => store.setState(paginationData), [paginationData]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default memo(StoreProvider);
