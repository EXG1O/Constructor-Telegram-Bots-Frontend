import { createContext } from 'react';

import { EmblaAPI } from '..';

export interface CarouselContextProps {
  api: EmblaAPI | undefined;
}

const CarouselContext = createContext<CarouselContextProps | undefined>(undefined);

export default CarouselContext;
