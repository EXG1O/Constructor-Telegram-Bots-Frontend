import { createContext } from 'react';

import { StoreApi, UseBoundStore } from 'zustand';

import { APIRequestBlockSlice } from '../store';

export type StoreContextType = UseBoundStore<StoreApi<APIRequestBlockSlice>>;

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export default StoreContext;
