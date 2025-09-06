import { useContext } from 'react';
import { useStore } from 'zustand';

import SimpleInputStoreContext, {
  SimpleInputStoreContextValue,
} from '../contexts/SimpleInputStoreContext';

import { State } from '../store';

type Store = SimpleInputStoreContextValue;

function useSimpleInputStore(): Store;
function useSimpleInputStore<Selector>(selector: (state: State) => Selector): Selector;
function useSimpleInputStore<Selector>(
  selector?: (state: State) => Selector,
): Selector | Store {
  const store = useContext(SimpleInputStoreContext);

  if (store === undefined) {
    throw new Error('useSimpleInputStore must be used with a SimpleInputStoreContext.');
  }

  return selector ? useStore(store, selector) : store;
}

export default useSimpleInputStore;
