import { useContext } from 'react';
import { useStore } from 'zustand';

import CodeInputStoreContext, {
  CodeInputStoreContextValue,
} from '../contexts/CodeInputStoreContext';

import { State } from '../store';

type Store = CodeInputStoreContextValue;

function useCodeInputStore(): Store;
function useCodeInputStore<Selector>(selector: (state: State) => Selector): Selector;
function useCodeInputStore<Selector>(
  selector?: (state: State) => Selector,
): Selector | Store {
  const store = useContext(CodeInputStoreContext);

  if (store === undefined) {
    throw new Error('useCodeInputStore must be used with a CodeInputStoreContext.');
  }

  return selector ? useStore(store, selector) : store;
}

export default useCodeInputStore;
