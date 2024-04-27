import { createContext } from 'react';

export interface ModalContextProps {
	loading: boolean;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export default ModalContext;