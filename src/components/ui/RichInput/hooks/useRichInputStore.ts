import { useContext } from 'react';
import { useStore } from 'zustand';

import RichInputStoreContext, {
  RichInputStoreContextValue,
} from '../contexts/RichInputStoreContext';

import { State } from '../store';

type Store = RichInputStoreContextValue;

function useRichInputStore(): Store;
function useRichInputStore<Selector>(selector: (state: State) => Selector): Selector;
function useRichInputStore<Selector>(
  selector?: (state: State) => Selector,
): Selector | Store {
  const store = useContext(RichInputStoreContext);

  if (store === undefined) {
    throw new Error('useRichInputStore must be used with a RichInputStoreContext.');
  }

  return selector ? useStore(store, selector) : store;
}

export default useRichInputStore;
