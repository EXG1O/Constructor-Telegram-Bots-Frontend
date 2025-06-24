import React, { ReactElement, ReactNode, useEffect, useMemo } from 'react';

import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import StoreContext from '../contexts/StoreContext';

import useTelegramBotMenuDatabaseRouteLoaderData from '../hooks/useTelegramBotMenuDatabaseRouteLoaderData';

import { createStore, InitialProps } from '../store';

export interface StoreProviderProps {
  children: ReactNode;
}

function StoreProvider({
  children,
}: StoreProviderProps): ReactElement<StoreProviderProps> {
  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();
  const { paginationData: rawPaginationData } =
    useTelegramBotMenuDatabaseRouteLoaderData();

  const paginationData = useMemo<
    Pick<InitialProps, 'count' | 'limit' | 'offset' | 'search' | 'records'>
  >(() => {
    const { results, ...paginationData } = rawPaginationData;
    return { ...paginationData, records: results };
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
