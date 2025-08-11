import { createContext } from 'react';

import { createStore } from '../store';

export type CodeInputStoreContextValue = ReturnType<typeof createStore>;

const CodeInputStoreContext = createContext<CodeInputStoreContextValue | undefined>(
  undefined,
);

export default CodeInputStoreContext;
