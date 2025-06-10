import { useContext } from 'react';

import CarouselContext, { CarouselContextProps } from '../contexts/CarouselContext';

function useCarousel(): CarouselContextProps {
  const context = useContext<CarouselContextProps | undefined>(CarouselContext);

  if (context === undefined) {
    throw new Error('useCarousel must be used with a CarouselContext.');
  }

  return context;
}

export default useCarousel;
