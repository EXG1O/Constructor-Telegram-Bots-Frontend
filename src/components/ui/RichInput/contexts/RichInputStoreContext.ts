import { createContext } from 'react';

import type { createStore } from '../store';

export type RichInputStoreContextValue = ReturnType<typeof createStore>;

const RichInputStoreContext = createContext<RichInputStoreContextValue | undefined>(
  undefined,
);

export default RichInputStoreContext;
