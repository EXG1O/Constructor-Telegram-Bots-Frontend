import { useContext } from 'react';
import { useStore } from 'zustand';

import StoreContext, { StoreContextValue } from '../contexts/StoreContext';

import { State } from '../store';

type Store = StoreContextValue;

function useUsersStore(): Store;
function useUsersStore<Selector>(selector: (state: State) => Selector): Selector;
function useUsersStore<Selector>(
	selector?: (state: State) => Selector,
): Selector | Store {
	const store = useContext(StoreContext);

	if (store === undefined) {
		throw new Error('useUsersStore must be used with a StoreProvider.');
	}

	return selector ? useStore(store, selector) : store;
}

export default useUsersStore;
