import { createContext } from 'react';

import type { createStore } from '../store';

export type CodeInputStoreContextValue = ReturnType<typeof createStore>;

const CodeInputStoreContext = createContext<CodeInputStoreContextValue | undefined>(
  undefined,
);

export default CodeInputStoreContext;
