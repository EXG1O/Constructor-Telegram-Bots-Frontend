import { createContext } from 'react';

export interface ModalContextProps {
  loading: boolean;
  onShow?: () => void;
  onShowed?: () => void;
  onHide?: () => void;
  onHidden?: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export default ModalContext;
