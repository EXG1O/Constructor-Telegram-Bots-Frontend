import { createContext } from 'react';

import { createStore } from '../store';

export type RichInputStoreContextValue = ReturnType<typeof createStore>;

const RichInputStoreContext = createContext<RichInputStoreContextValue | undefined>(
  undefined,
);

export default RichInputStoreContext;
