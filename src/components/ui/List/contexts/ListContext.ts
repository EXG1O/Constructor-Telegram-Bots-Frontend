import { createContext } from 'react';

import { Size } from '..';

export interface ListContextProps {
  size: Size;
  striped: boolean;
}

const ListContext = createContext<ListContextProps | undefined>(undefined);

export default ListContext;
