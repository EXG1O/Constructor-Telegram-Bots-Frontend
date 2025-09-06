import { createContext } from 'react';

import { createStore } from '../store';

export type SimpleInputStoreContextValue = ReturnType<typeof createStore>;

const SimpleInputStoreContext = createContext<SimpleInputStoreContextValue | undefined>(
  undefined,
);

export default SimpleInputStoreContext;
