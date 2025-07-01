import { useContext } from 'react';

import OffcanvasContext, { OffcanvasContextProps } from '../contexts/OffcanvasContext';

function useOffcanvas(): OffcanvasContextProps {
  const context = useContext<OffcanvasContextProps | undefined>(OffcanvasContext);

  if (context === undefined) {
    throw new Error('useOffcanvas must be used with a OffcanvasContext.');
  }

  return context;
}

export default useOffcanvas;
