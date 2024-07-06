import { useContext } from 'react';
import { useStore } from 'zustand';

import StoreContext, { StoreContextValue } from '../contexts/StoreContext';

import { State } from '../store';

type Store = StoreContextValue;

function useCommandOffcanvasStore(): Store;
function useCommandOffcanvasStore<Selector>(
	selector: (state: State) => Selector,
): Selector;
function useCommandOffcanvasStore<Selector>(
	selector?: (state: State) => Selector,
): Selector | Store {
	const store = useContext(StoreContext);

	if (store === undefined) {
		throw new Error(
			'useCommandOffcanvasStore must be used with a StoreContext.Provider!',
		);
	}

	return selector ? useStore(store, selector) : store;
}

export default useCommandOffcanvasStore;
