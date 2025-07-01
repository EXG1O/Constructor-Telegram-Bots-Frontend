import React, { forwardRef, HTMLAttributes, useEffect } from 'react';
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';

import CarouselIndicators from './components/CarouselIndicators';
import CarouselItem from './components/CarouselItem';
import CarouselNextButton from './components/CarouselNextButton';
import CarouselPrevButton from './components/CarouselPrevButton';
import CarouselContext from './contexts/CarouselContext';

import cn from 'utils/cn';

export type EmblaAPI = NonNullable<UseEmblaCarouselType[1]>;

export interface CarouselProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  height: string;
  onMount?: (api: EmblaAPI) => void;
  onSelect?: (api: EmblaAPI) => void;
}

const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  ({ height, className, children, onMount, onSelect, ...props }, ref) => {
    const [emblaRef, api] = useEmblaCarousel({ loop: true });

    useEffect(() => {
      if (!api || !onMount || !onSelect) return;

      if (onMount) {
        api.on('reInit', onMount);
      }

      if (onSelect) {
        api.on('reInit', onSelect);
        api.on('select', onSelect);
      }

      return () => {
        if (onMount) {
          api.on('reInit', onMount);
        }

        if (onSelect) {
          api.off('reInit', onSelect);
          api.off('select', onSelect);
        }
      };
    }, [api, onSelect, onMount]);

    return (
      <div
        {...props}
        ref={ref}
        className={cn(
          'flex',
          'flex-col',
          'w-full',
          'gap-2',
          'overflow-hidden',
          className,
        )}
      >
        <CarouselContext.Provider value={{ api }}>
          <div className='relative flex-auto'>
            <div ref={emblaRef}>
              <div className='flex gap-2' style={{ height }}>
                {children}
              </div>
            </div>
            <CarouselPrevButton />
            <CarouselNextButton />
          </div>
          <CarouselIndicators />
        </CarouselContext.Provider>
      </div>
    );
  },
);
Carousel.displayName = 'Carousel';

export default Object.assign(Carousel, { Item: CarouselItem });
