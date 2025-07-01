import { useContext } from 'react';

import TabsContext, { TabsContextProps } from '../contexts/TabsContext';

function useTabs(): TabsContextProps {
  const context = useContext(TabsContext);

  if (context === undefined) {
    throw new Error('useTabs must be used with a TabsContext.');
  }

  return context;
}

export default useTabs;
