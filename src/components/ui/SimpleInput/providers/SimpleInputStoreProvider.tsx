import React, {
  memo,
  type ReactElement,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useStore } from 'zustand';

import { DEFAULT_SIZE } from '..';

import StoreContext from '../contexts/SimpleInputStoreContext';

import { createStore, type StateProps } from '../store';

export interface SimpleInputStoreProviderProps extends Partial<StateProps> {
  children: ReactNode;
}

function SimpleInputStoreProvider({
  size = DEFAULT_SIZE,
  invalid = false,
  value,
  children,
  ...props
}: SimpleInputStoreProviderProps): ReactElement {
  const storeJustCreated = useRef<boolean>(true);

  const store = useMemo(() => {
    storeJustCreated.current = false;
    return createStore({ ...props, size, invalid });
  }, []);

  const setValue = useStore(store, (state) => state.setValue);

  useEffect(() => {
    if (storeJustCreated.current) return;
    store.setState({ ...props, size, invalid });
  }, [size, invalid, props]);
  useEffect(() => {
    if (value === undefined) return;
    setValue(value);
  }, [value]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default memo(SimpleInputStoreProvider);
