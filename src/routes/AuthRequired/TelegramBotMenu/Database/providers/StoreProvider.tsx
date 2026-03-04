import React, { type ReactElement, type ReactNode, useMemo } from 'react';

import StoreContext from '../contexts/StoreContext';

import useTelegramBotMenuDatabaseRouteLoaderData from '../hooks/useTelegramBotMenuDatabaseRouteLoaderData';

import { createStore } from '../store';

export interface StoreProviderProps {
  children: ReactNode;
}

function StoreProvider({ children }: StoreProviderProps): ReactElement {
  const { pagination } = useTelegramBotMenuDatabaseRouteLoaderData();

  const store = useMemo(() => {
    const { results, ...rest } = pagination;
    return createStore({ ...rest, records: results });
  }, [pagination]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default StoreProvider;
