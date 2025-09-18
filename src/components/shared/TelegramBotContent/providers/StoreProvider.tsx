import React, { ReactElement, ReactNode, useEffect, useMemo } from 'react';
import isEqual from 'lodash/isEqual';

import StoreContext from '../contexts/StoreContext';

import { createStore, InitialStoreProps, StoreState } from '../store';

export interface StoreProviderProps extends InitialStoreProps {
  children: ReactNode;
}

function StoreProvider({ children, ...props }: StoreProviderProps): ReactElement {
  const store = useMemo(() => createStore(props), []);

  useEffect(() => {
    const state: StoreState = store.getState();
    const stateProps: typeof props = {
      telegramBot: state.telegramBot,
      onChange: state.onChange,
    };
    if (isEqual(props, stateProps)) return;
    store.setState(props);
  }, [props]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default StoreProvider;
