import React, { memo, ReactElement, ReactNode, useEffect, useMemo } from 'react';

import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import StoreContext from '../contexts/StoreContext';

import useTelegramBotMenuVariablesRouteLoaderData from '../../../hooks/useTelegramBotMenuVariablesRouteLoaderData';

import { createStore, InitialProps } from '../store';

export interface StoreProviderProps {
  children: ReactNode;
}

function StoreProvider({
  children,
}: StoreProviderProps): ReactElement<StoreProviderProps> {
  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();
  const { paginationData: initialPaginationData } =
    useTelegramBotMenuVariablesRouteLoaderData();

  const paginationData = useMemo<Omit<InitialProps, 'telegramBot'>>(
    () => ({
      count: initialPaginationData.count,
      limit: initialPaginationData.limit,
      offset: initialPaginationData.offset,
      variables: initialPaginationData.results,
    }),
    [initialPaginationData],
  );

  const store = useMemo(() => createStore({ telegramBot, ...paginationData }), []);

  useEffect(() => store.setState(paginationData), [paginationData]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default memo(StoreProvider);
