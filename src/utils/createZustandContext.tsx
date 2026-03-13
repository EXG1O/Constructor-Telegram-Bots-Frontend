import React, { type ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { createContext, type ReactElement } from 'react';
import { type ExtractState, type StoreApi, useStore } from 'zustand';

interface ZustandStoreProviderProps<StateProps> {
  stateProps: StateProps;
  children: ReactNode;
}

export interface BaseState<StateProps> {
  syncFromProps: (props: StateProps) => void;
}

function createZustandContext<
  StateProps,
  Store extends StoreApi<BaseState<StateProps>>,
>(getStore: (stateProps: StateProps) => Store) {
  const StoreContext = createContext<Store | null>(null);

  function ZustandStoreProvider({
    stateProps,
    children,
  }: ZustandStoreProviderProps<StateProps>): ReactElement {
    const [store] = useState<Store>(() => getStore(stateProps));
    const firstRender = useRef<boolean>(true);

    useEffect(() => {
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }
      store.getState().syncFromProps(stateProps);
    }, [stateProps]);

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
