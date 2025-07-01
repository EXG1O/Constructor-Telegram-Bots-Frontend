import { useContext } from 'react';

import ModalContext, { ModalContextProps } from '../contexts/ModalContext';

function useModal(): ModalContextProps {
  const context = useContext<ModalContextProps | undefined>(ModalContext);

  if (context === undefined) {
    throw new Error('useModal must be used with a ModalContext.');
  }

  return context;
}

export default useModal;
