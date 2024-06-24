import { useContext } from 'react';

import { useStore } from 'zustand';

import StoreContext from '../contexts/StoreContext';

function useAddonButtonGroupStore<Selector>(
	selector: (state: any) => Selector,
): Selector {
	const store = useContext(StoreContext);

	if (store === undefined) {
		throw new Error(
			'useAddonButtonGroupStore must be used with a StoreContext.Provider.',
		);
	}

	return useStore(store, selector);
}

export default useAddonButtonGroupStore;
