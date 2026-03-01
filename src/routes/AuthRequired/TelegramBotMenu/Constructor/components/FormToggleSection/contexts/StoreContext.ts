import { createContext } from 'react';

import { createStore } from '../store';

export type StoreContextValue = ReturnType<typeof createStore>;

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export default StoreContext;
