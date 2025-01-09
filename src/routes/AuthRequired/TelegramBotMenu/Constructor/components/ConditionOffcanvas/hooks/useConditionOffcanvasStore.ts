import { useContext } from 'react';
import { useStore } from 'zustand';

import StoreContext, { StoreContextValue } from '../contexts/StoreContext';

import { State } from '../store';

type Store = StoreContextValue;

function useConditionOffcanvasStore(): Store;
function useConditionOffcanvasStore<Selector>(
	selector: (state: State) => Selector,
): Selector;
function useConditionOffcanvasStore<Selector>(
	selector?: (state: State) => Selector,
): Selector | Store {
	const store = useContext(StoreContext);

	if (store === undefined) {
		throw new Error(
			'useConditionOffcanvasStore must be used with a StoreContext.Provider.',
		);
	}

	return selector ? useStore(store, selector) : store;
}

export default useConditionOffcanvasStore;
