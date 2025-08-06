import { useContext } from 'react';

import ListContext, { ListContextProps } from '../contexts/ListContext';

function useList(): ListContextProps {
  const context = useContext<ListContextProps | undefined>(ListContext);

  if (context === undefined) {
    throw new Error('useList must be used with a ListContext.');
  }

  return context;
}

export default useList;
