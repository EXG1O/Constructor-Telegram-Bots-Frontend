import React, { type ReactElement, type ReactNode, useMemo } from 'react';

import StoreContext from '../contexts/StoreContext';

import useTelegramBotMenuUsersRouteLoaderData from '../hooks/useTelegramBotMenuUsersRouteLoaderData';

import { createStore } from '../store';

export interface StoreProviderProps {
  children: ReactNode;
}

function StoreProvider({ children }: StoreProviderProps): ReactElement {
  const { pagination } = useTelegramBotMenuUsersRouteLoaderData();

  const store = useMemo(() => {
    const { results, ...rest } = pagination;
    return createStore({ ...rest, users: results });
  }, [pagination]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default StoreProvider;
