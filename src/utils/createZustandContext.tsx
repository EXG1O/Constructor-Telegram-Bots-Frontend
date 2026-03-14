import React, { type ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { createContext, type ReactElement } from 'react';
import { type ExtractState, type StoreApi, useStore } from 'zustand';

interface ZustandStoreProviderProps<StoreProps> {
  storeProps: StoreProps;
  children: ReactNode;
}

export interface BaseState<StoreProps> {
  syncFromProps: (props: StoreProps) => void;
}

function createZustandContext<
  StoreProps,
  Store extends StoreApi<BaseState<StoreProps>>,
>(getStore: (storeProps: StoreProps) => Store) {
  const StoreContext = createContext<Store | null>(null);

  function ZustandStoreProvider({
    storeProps,
    children,
  }: ZustandStoreProviderProps<StoreProps>): ReactElement {
    const [store] = useState<Store>(() => getStore(storeProps));
    const firstRender = useRef<boolean>(true);

    useEffect(() => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      store.getState().syncFromProps(storeProps);
    }, [storeProps]);

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
  }

  function useZustandStore(): Store;
  function useZustandStore<Selector>(
    selector: (state: ExtractState<Store>) => Selector,
  ): Selector;
  function useZustandStore<Selector>(
    selector?: (state: ExtractState<Store>) => Selector,
  ): Selector | Store {
    const store = useContext(StoreContext);

    if (!store) {
      throw new Error('useZustandStore must be used with a ZustandStoreProvider.');
    }

    return selector ? useStore(store, selector) : store;
  }

  return [ZustandStoreProvider, useZustandStore] as const;
}

export default createZustandContext;
