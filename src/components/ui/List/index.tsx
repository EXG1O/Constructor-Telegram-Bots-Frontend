import React, { ReactElement, useMemo } from 'react';
import { Slot } from '@radix-ui/react-slot';

import ListItem from './components/ListItem';
import ListContext, { ListContextProps } from './contexts/ListContext';

export type Size = 'sm' | 'md';

export const DEFAULT_SIZE: Size = 'md';

export interface ListProps extends Partial<ListContextProps> {
  children: ReactElement;
}

function List({
  size = DEFAULT_SIZE,
  striped = false,
  children,
}: ListProps): ReactElement {
  const contextValue = useMemo<ListContextProps>(
    () => ({ size, striped }),
    [size, striped],
  );

  return (
    <ListContext.Provider value={contextValue}>
      <Slot>{children}</Slot>
    </ListContext.Provider>
  );
}

export default Object.assign(List, { Item: ListItem });
