import React, { ReactElement, ReactNode, useEffect, useMemo } from 'react';

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
  const { paginationData: rawPaginationData } =
    useTelegramBotMenuUsersRouteLoaderData();

  const paginationData = useMemo<
    Pick<InitialProps, 'count' | 'limit' | 'offset' | 'search' | 'type' | 'users'>
  >(() => {
    const { results, ...paginationData } = rawPaginationData;
    return { ...paginationData, users: results };
  }, [rawPaginationData]);
  const store = useMemo(
    () => createStore({ telegramBot, ...paginationData }),
    [telegramBot, paginationData],
  );

  useEffect(
    () => store.setState({ telegramBot, ...paginationData }),
    [telegramBot, paginationData],
  );

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default StoreProvider;
