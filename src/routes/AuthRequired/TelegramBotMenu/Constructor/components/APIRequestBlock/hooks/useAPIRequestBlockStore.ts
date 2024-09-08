import { useContext } from 'react';
import { useStore } from 'zustand';

import StoreContext, { StoreContextType } from '../contexts/StoreContext';

import { APIRequestBlockSlice } from '../store';

type Store = StoreContextType;

function useAPIRequestBlockStore(): Store;
function useAPIRequestBlockStore<Selector>(
	selector: (state: APIRequestBlockSlice) => Selector,
): Selector;
function useAPIRequestBlockStore<Selector>(
	selector?: (state: APIRequestBlockSlice) => Selector,
): Selector | Store {
	const store = useContext(StoreContext);

	if (store === undefined) {
		throw new Error(
			'useAPIRequestBlockStore must be used with a StoreContext.Provider.',
		);
	}

	return selector ? useStore(store, selector) : store;
}

export default useAPIRequestBlockStore;
