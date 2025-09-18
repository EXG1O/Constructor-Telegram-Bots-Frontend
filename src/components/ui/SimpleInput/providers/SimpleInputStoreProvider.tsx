import React, {
  memo,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useStore } from 'zustand';

import StoreContext from '../contexts/SimpleInputStoreContext';

import { createStore, StateProps } from '../store';

export interface SimpleInputStoreProviderProps extends StateProps {
  children: ReactNode;
}

function SimpleInputStoreProvider({
  value,
  children,
  ...props
}: SimpleInputStoreProviderProps): ReactElement {
  const storeJustCreated = useRef<boolean>(true);

  const store = useMemo(() => {
    storeJustCreated.current = false;
    return createStore(props);
  }, []);

  const setValue = useStore(store, (state) => state.setValue);

  useEffect(() => {
    if (storeJustCreated) return;
    store.setState(props);
  }, [props]);
  useEffect(() => {
    const state = store.getState();
    if (value === state.value) return;
    setValue(value as string);
  }, [value]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default memo(SimpleInputStoreProvider);
