import { useContext } from 'react';
import { useStore } from 'zustand';

import StoreContext, { type StoreContextValue } from '../contexts/StoreContext';

import type { State } from '../store';

type Store = StoreContextValue;

function useFormToggleSectionStore(): Store;
function useFormToggleSectionStore<Selector>(
  selector: (state: State) => Selector,
): Selector;
function useFormToggleSectionStore<Selector>(
  selector?: (state: State) => Selector,
): Selector | Store {
  const store = useContext(StoreContext);

  if (store === undefined) {
    throw new Error('useFormToggleSectionStore must be used with a StoreProvider.');
  }

  return selector ? useStore(store, selector) : store;
}

export default useFormToggleSectionStore;
