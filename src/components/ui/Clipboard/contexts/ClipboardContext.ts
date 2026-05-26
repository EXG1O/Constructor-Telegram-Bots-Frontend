import { createContext } from 'react';

export interface ClipboardContextProps {
  triggerClassName: string;
}

const ClipboardContext = createContext<ClipboardContextProps | undefined>(undefined);

export default ClipboardContext;
