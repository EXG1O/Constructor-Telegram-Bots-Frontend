import React, { ReactElement, ReactNode, useEffect, useMemo } from 'react';
import isEqual from 'lodash/isEqual';

import StoreContext from '../contexts/StoreContext';

import { createStore, InitialStoreProps } from '../store';

export interface StoreProviderProps extends InitialStoreProps {
  children: ReactNode;
}

function StoreProvider({ children, ...props }: StoreProviderProps): ReactElement {
  const store = useMemo(() => createStore(props), []);

  useEffect(() => {
    if (isEqual(props, store.getState().initialProps)) return;
    store.setState(props);
  }, [props]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default StoreProvider;
