import React, { ReactElement, ReactNode, useEffect, useMemo } from 'react';

import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import StoreContext from '../contexts/StoreContext';

import useTelegramBotMenuVariablesRouteLoaderData from '../../../hooks/useTelegramBotMenuVariablesRouteLoaderData';

import { createStore, InitialProps } from '../store';

export interface StoreProviderProps {
  children: ReactNode;
}

function StoreProvider({ children }: StoreProviderProps): ReactElement {
  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();
  const { paginationData: rawPaginationData } =
    useTelegramBotMenuVariablesRouteLoaderData();

  const paginationData = useMemo<
    Pick<InitialProps, 'count' | 'limit' | 'offset' | 'variables'>
  >(() => {
    const { results, ...paginationData } = rawPaginationData;
    return { ...paginationData, variables: results };
  }, [rawPaginationData]);
  const store = useMemo(() => createStore({ telegramBot, ...paginationData }), []);

  useEffect(
    () => store.setState({ telegramBot, ...paginationData }),
    [telegramBot, paginationData],
  );

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default StoreProvider;
