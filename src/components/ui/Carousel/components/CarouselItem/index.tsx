import React, { forwardRef, HTMLAttributes, useEffect, useState } from 'react';

import ItemImage from './components/ItemImage';

import useCarousel from '../../hooks/useCarousel';

import cn from 'utils/cn';

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {}

const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, ...props }, ref) => {
    const { api } = useCarousel();

    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    useEffect(() => {
      if (!api) return;

      const onInit = () => {
        setScrollSnaps(api.scrollSnapList());
      };

      onInit();
      api.on('reInit', onInit);
      return () => {
        api.off('reInit', onInit);
      };
    }, [api]);

    return (
      <div
        {...props}
        ref={ref}
        className={cn(
          'shrink-0',
          scrollSnaps.length > 1 ? 'basis-4/5' : 'basis-full',
          'bg-gray-100',
          'border',
          'border-outline',
          'rounded-sm',
          'overflow-hidden',
          'not-first:last:mr-2',
          className,
        )}
      />
    );
  },
);
CarouselItem.displayName = 'CarouselItem';

export default Object.assign(CarouselItem, { Image: ItemImage });
