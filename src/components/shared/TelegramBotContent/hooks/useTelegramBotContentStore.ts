import { useContext } from 'react';
import { useStore } from 'zustand';

import StoreContext, { type StoreContextValue } from '../contexts/StoreContext';

import type { StoreState } from '../store';

type Store = StoreContextValue;

function useTelegramBotContentStore(): Store;
function useTelegramBotContentStore<Selector>(
  selector: (state: StoreState) => Selector,
): Selector;
function useTelegramBotContentStore<Selector>(
  selector?: (state: StoreState) => Selector,
): Selector | Store {
  const store = useContext(StoreContext);

  if (store === undefined) {
    throw new Error('useTelegramBotContentStore must be used with a StoreProvider.');
  }

  return selector ? useStore(store, selector) : store;
}

export default useTelegramBotContentStore;
