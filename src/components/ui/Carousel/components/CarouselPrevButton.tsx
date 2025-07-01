import React, { forwardRef } from 'react';
import { ArrowLeft } from 'lucide-react';

import { EmblaAPI } from '..';

import CarouselDirectionButton, {
  CarouselDirectionButtonProps,
} from './CarouselDirectionButton';

export interface CarouselPrevButtonProps
  extends Omit<CarouselDirectionButtonProps, 'onCanScroll' | 'onScroll'> {}

const CarouselPrevButton = forwardRef<HTMLButtonElement, CarouselPrevButtonProps>(
  (props, ref) => {
    function handleCanScroll(api: EmblaAPI): boolean {
      return api.canScrollPrev();
    }

    function handleScroll(api: EmblaAPI): void {
      api?.scrollPrev();
    }

    return (
      <CarouselDirectionButton
        {...props}
        ref={ref}
        className='left-2'
        onCanScroll={handleCanScroll}
        onScroll={handleScroll}
      >
        <ArrowLeft />
      </CarouselDirectionButton>
    );
  },
);
CarouselPrevButton.displayName = 'CarouselPrevButton';

export default CarouselPrevButton;
