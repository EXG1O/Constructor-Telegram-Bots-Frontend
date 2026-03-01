import React, { ReactElement, ReactNode, useMemo } from 'react';

import StoreContext from '../contexts/StoreContext';

import useTelegramBotMenuVariablesRouteLoaderData from '../../../hooks/useTelegramBotMenuVariablesRouteLoaderData';

import { createStore } from '../store';

export interface StoreProviderProps {
  children: ReactNode;
}

function StoreProvider({ children }: StoreProviderProps): ReactElement {
  const { pagination } = useTelegramBotMenuVariablesRouteLoaderData();

  const store = useMemo(() => {
    const { results, ...rest } = pagination;
    return createStore({ ...rest, variables: results });
  }, [pagination]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default StoreProvider;
