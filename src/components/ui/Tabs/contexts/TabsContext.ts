import { createContext } from 'react';

export interface TabsContextProps {
  size: 'sm' | 'md' | 'lg';
  value: string;
  onChange?: (value: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

export default TabsContext;
