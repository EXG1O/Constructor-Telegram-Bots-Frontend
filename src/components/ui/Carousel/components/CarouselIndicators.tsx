import React, { forwardRef, HTMLAttributes, useEffect, useState } from 'react';

import Pagination from 'components/ui/Pagination';

import useCarousel from '../hooks/useCarousel';

import cn from 'utils/cn';

export interface CarouselIndicatorsProps extends HTMLAttributes<HTMLDivElement> {}

const CarouselIndicators = forwardRef<HTMLDivElement, CarouselIndicatorsProps>(
  ({ children, className, ...props }, ref) => {
    const { api } = useCarousel();

    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    useEffect(() => {
      if (!api) return;

      const onInit = () => {
        setScrollSnaps(api.scrollSnapList());
      };
      const onSelect = () => {
        setSelectedIndex(api.selectedScrollSnap());
      };

      onInit();
      onSelect();
      api.on('reInit', onInit);
      api.on('reInit', onSelect);
      api.on('scroll', onSelect);
      return () => {
        api.off('reInit', onInit);
        api.off('reInit', onSelect);
        api.off('scroll', onSelect);
      };
    }, [api]);

    function handlePageChange(nextIndex: number): void {
      api?.scrollTo(nextIndex);
    }

    return (
      <div {...props} ref={ref} className={cn('flex', 'justify-center', className)}>
        {children}
        <Pagination
          size='sm'
          itemCount={scrollSnaps.length}
          itemLimit={1}
          itemOffset={selectedIndex}
          onPageChange={handlePageChange}
        />
      </div>
    );
  },
);
CarouselIndicators.displayName = 'CarouselIndicators';

export default CarouselIndicators;
