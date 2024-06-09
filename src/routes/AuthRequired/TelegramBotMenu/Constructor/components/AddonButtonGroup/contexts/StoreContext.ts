import { createContext } from 'react';
import { StoreApi, UseBoundStore } from 'zustand';

export type StoreContextType = UseBoundStore<StoreApi<any>>;

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export default StoreContext;
