import { createContext } from 'react';

export interface OffcanvasContextProps {
	loading: boolean;
}

const OffcanvasContext = createContext<OffcanvasContextProps | undefined>(undefined);

export default OffcanvasContext;